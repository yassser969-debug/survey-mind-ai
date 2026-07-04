import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import ResetForm from "./reset-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/forgot-password");

  // Local development fallback: without an email provider configured,
  // surface the pending reset code so the flow stays testable end-to-end.
  let devCode: string | null = null;
  if (!process.env.RESEND_API_KEY) {
    const row = getDb()
      .prepare(
        `SELECT c.code FROM email_codes c
         JOIN users u ON u.id = c.user_id
         WHERE u.email = ? AND c.purpose = 'reset' AND c.consumed_at IS NULL
           AND c.expires_at > datetime('now')
         ORDER BY c.id DESC LIMIT 1`
      )
      .get(email.toLowerCase()) as { code: string } | undefined;
    devCode = row?.code ?? null;
  }

  return <ResetForm email={email} devCode={devCode} />;
}
