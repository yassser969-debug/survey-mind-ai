import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, setSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await verifyCredentials(email ?? "", password ?? "");
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSession(user);
  return NextResponse.json({ user });
}
