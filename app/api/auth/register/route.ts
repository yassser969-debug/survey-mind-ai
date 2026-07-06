import { NextRequest, NextResponse } from "next/server";
import { createUser, setSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, name, password } = await request.json();

  if (!email || !name || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Please provide a name, email, and a password of at least 6 characters." },
      { status: 400 },
    );
  }

  try {
    const user = createUser(email, name, password);
    await setSession(user);
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
