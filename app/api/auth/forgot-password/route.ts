import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const token = createPasswordResetToken(email ?? "");

  // No email service is configured in this environment, so the reset link
  // is logged server-side for the operator to relay manually instead of
  // being returned to the caller — returning it in the response would let
  // anyone reset any account's password just by knowing their email.
  // Wire up an email provider (e.g. Resend, SendGrid) here before shipping
  // this to real users, and remove this log line once that's in place.
  if (token) {
    console.log(`[password reset] ${email}: /reset-password?token=${token}`);
  }

  // Same response whether or not the account exists, so this endpoint can't
  // be used to enumerate registered emails.
  return NextResponse.json({ ok: true });
}
