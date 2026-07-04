import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getDict, getLocale } from "@/lib/i18n";
import VerifyForm from "./verify-form";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/signup");

  const t = await getDict();
  const locale = await getLocale();

  // Local development fallback: without an email provider configured,
  // surface the pending code so the flow stays testable end-to-end.
  let devCode: string | null = null;
  if (!process.env.RESEND_API_KEY) {
    const row = getDb()
      .prepare(
        `SELECT c.code FROM email_codes c
         JOIN users u ON u.id = c.user_id
         WHERE u.email = ? AND c.purpose = 'verify' AND c.consumed_at IS NULL
           AND c.expires_at > datetime('now')
         ORDER BY c.id DESC LIMIT 1`
      )
      .get(email.toLowerCase()) as { code: string } | undefined;
    devCode = row?.code ?? null;
  }

  return (
    <VerifyForm
      email={email}
      devCode={devCode}
      t={t.verify}
      common={t.common}
      dir={t.dir}
      locale={locale}
    />
  );
}
