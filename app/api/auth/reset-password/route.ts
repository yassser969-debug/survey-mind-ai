import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { token, password } = await request.json();

  if (!token || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Please provide a valid token and a password of at least 6 characters." },
      { status: 400 },
    );
  }

  const ok = await resetPassword(token, password);
  if (!ok) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
