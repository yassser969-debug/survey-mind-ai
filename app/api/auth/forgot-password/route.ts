import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const token = createPasswordResetToken(email ?? "");

  // No email service is configured in this environment, so the reset link is
  // returned directly instead of being sent. Wire up an email provider (e.g.
  // Resend, SendGrid) here before shipping this to real users.
  return NextResponse.json({
    ok: true,
    resetUrl: token ? `/reset-password?token=${token}` : null,
  });
}
