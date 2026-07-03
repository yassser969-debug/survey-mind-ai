import "server-only";

/**
 * Sends the verification code to the user's inbox.
 *
 * With RESEND_API_KEY set, the code is emailed via Resend. Without it
 * (local development), the code is printed to the server console and
 * returned so the verify page can display it as a dev hint.
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<{ devCode: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[dev-mail] Verification code for ${email}: ${code}`);
    return { devCode: code };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "SurveyMind AI <onboarding@resend.dev>",
      to: [email],
      subject: `${code} is your SurveyMind AI verification code`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
          <h2>Verify your email</h2>
          <p>Use this code to verify your SurveyMind AI account:</p>
          <p style="font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p>
          <p>This code expires in 15 minutes.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send verification email: ${body}`);
  }

  return { devCode: null };
}
