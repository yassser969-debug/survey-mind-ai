"use server";

import { redirect } from "next/navigation";
import { getDb } from "../db";
import {
  consumeVerificationCode,
  createSession,
  destroySession,
  ensureAdminAccount,
  generateVerificationCode,
  hashPassword,
  verifyPassword,
} from "../auth";
import { sendVerificationEmail } from "../mail";

export type FormState = { error: string } | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "student");

  if (name.length < 2) return { error: "Please enter your full name." };
  if (!EMAIL_PATTERN.test(email))
    return { error: "Please enter a valid email address." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (role !== "student" && role !== "lecturer")
    return { error: "Please choose an account type." };

  const db = getDb();
  ensureAdminAccount();

  const existing = db
    .prepare("SELECT id, email_verified_at FROM users WHERE email = ?")
    .get(email) as { id: number; email_verified_at: string | null } | undefined;

  let userId: number;

  if (existing && existing.email_verified_at) {
    return { error: "An account with this email already exists. Sign in instead." };
  } else if (existing) {
    // Unverified leftover signup: refresh it so the user can try again.
    db.prepare(
      "UPDATE users SET name = ?, password_hash = ?, role = ? WHERE id = ?"
    ).run(name, hashPassword(password), role, existing.id);
    userId = existing.id;
  } else {
    const result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
      )
      .run(name, email, hashPassword(password), role);
    userId = Number(result.lastInsertRowid);
  }

  const code = generateVerificationCode(userId);

  try {
    await sendVerificationEmail(email, code);
  } catch {
    return { error: "We could not send the verification email. Please try again." };
  }

  redirect(`/verify?email=${encodeURIComponent(email)}`);
}

export async function verifyEmail(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim();

  const user = getDb()
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email) as { id: number } | undefined;

  if (!user) return { error: "Account not found. Please sign up again." };

  if (!consumeVerificationCode(user.id, code)) {
    return { error: "Invalid or expired code. Please try again." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function resendCode(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const user = getDb()
    .prepare("SELECT id, email_verified_at FROM users WHERE email = ?")
    .get(email) as { id: number; email_verified_at: string | null } | undefined;

  if (!user) return { error: "Account not found. Please sign up again." };
  if (user.email_verified_at)
    return { error: "This email is already verified. You can sign in." };

  const code = generateVerificationCode(user.id);

  try {
    await sendVerificationEmail(email, code);
  } catch {
    return { error: "We could not send the verification email. Please try again." };
  }

  return null;
}

export async function login(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  ensureAdminAccount();

  const user = getDb()
    .prepare(
      "SELECT id, password_hash, email_verified_at, banned_at FROM users WHERE email = ?"
    )
    .get(email) as
    | {
        id: number;
        password_hash: string;
        email_verified_at: string | null;
        banned_at: string | null;
      }
    | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Incorrect email or password." };
  }

  if (user.banned_at) {
    return { error: "This account has been blocked by the administrator." };
  }

  if (!user.email_verified_at) {
    const code = generateVerificationCode(user.id);
    try {
      await sendVerificationEmail(email, code);
    } catch {
      return { error: "We could not send the verification email. Please try again." };
    }
    redirect(`/verify?email=${encodeURIComponent(email)}`);
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
