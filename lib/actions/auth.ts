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
  resetPassword as applyPasswordReset,
  verifyPasswordSafe,
} from "../auth";
import { sendVerificationEmail } from "../mail";
import { checkRateLimit, clearRateLimit } from "../rate-limit";
import { getDict } from "../i18n";

export type FormState = { error: string } | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 255);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const role = String(formData.get("role") ?? "student");

  if (name.length < 2) return { error: t.name };
  if (!EMAIL_PATTERN.test(email))
    return { error: t.email };
  if (password.length < 8 || password.length > 100)
    return { error: t.password };
  if (password !== confirm)
    return { error: t.passwordMatch };
  if (role !== "student" && role !== "lecturer")
    return { error: t.role };

  if (!checkRateLimit(`signup:${email}`, 3, 60 * 60)) {
    return { error: t.tooMany };
  }

  const db = getDb();
  ensureAdminAccount();

  const existing = db
    .prepare("SELECT id, email_verified_at FROM users WHERE email = ?")
    .get(email) as { id: number; email_verified_at: string | null } | undefined;

  let userId: number;

  if (existing && existing.email_verified_at) {
    return { error: t.emailExists };
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

  const code = generateVerificationCode(userId, "verify");

  try {
    await sendVerificationEmail(email, code);
  } catch {
    return { error: t.emailSend };
  }

  redirect(`/verify?email=${encodeURIComponent(email)}`);
}

export async function verifyEmail(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim().slice(0, 6);

  if (!checkRateLimit(`verify:${email}`, 10, 15 * 60)) {
    return { error: t.tooMany };
  }

  const user = getDb()
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email) as { id: number } | undefined;

  if (!user || !consumeVerificationCode(user.id, code, "verify")) {
    return { error: t.badCode };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function resendCode(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!checkRateLimit(`resend:${email}`, 3, 10 * 60)) {
    return { error: t.tooMany };
  }

  const user = getDb()
    .prepare("SELECT id, email_verified_at FROM users WHERE email = ?")
    .get(email) as { id: number; email_verified_at: string | null } | undefined;

  if (!user) return { error: t.accountNotFound };
  if (user.email_verified_at)
    return { error: t.alreadyVerified };

  const code = generateVerificationCode(user.id, "verify");

  try {
    await sendVerificationEmail(email, code);
  } catch {
    return { error: t.emailSend };
  }

  return null;
}

export async function login(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 255);
  const password = String(formData.get("password") ?? "").slice(0, 100);

  if (!checkRateLimit(`login:${email}`, 5, 15 * 60)) {
    return { error: t.tooMany };
  }

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

  if (!verifyPasswordSafe(password, user?.password_hash)) {
    return { error: t.badCredentials };
  }

  if (user!.banned_at) {
    return { error: t.blocked };
  }

  if (!user!.email_verified_at) {
    const code = generateVerificationCode(user!.id, "verify");
    try {
      await sendVerificationEmail(email, code);
    } catch {
      return { error: t.emailSend };
    }
    redirect(`/verify?email=${encodeURIComponent(email)}`);
  }

  clearRateLimit(`login:${email}`);
  await createSession(user!.id);
  redirect("/dashboard");
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 255);

  if (!EMAIL_PATTERN.test(email))
    return { error: t.email };

  if (!checkRateLimit(`forgot:${email}`, 3, 15 * 60)) {
    return { error: t.tooMany };
  }

  const user = getDb()
    .prepare("SELECT id, banned_at FROM users WHERE email = ?")
    .get(email) as { id: number; banned_at: string | null } | undefined;

  // Send the code only for real, unblocked accounts — but always continue
  // to the next step so the form never reveals whether an email exists.
  if (user && !user.banned_at) {
    const code = generateVerificationCode(user.id, "reset");
    try {
      await sendVerificationEmail(email, code);
    } catch {
      return { error: t.emailSend };
    }
  }

  redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}

export async function resetPassword(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim().slice(0, 6);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8 || password.length > 100)
    return { error: t.password };
  if (password !== confirm) return { error: t.passwordMatch };

  if (!checkRateLimit(`reset:${email}`, 10, 15 * 60)) {
    return { error: t.tooMany };
  }

  const user = getDb()
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email) as { id: number } | undefined;

  if (!user || !consumeVerificationCode(user.id, code, "reset")) {
    return { error: t.badCode };
  }

  applyPasswordReset(user.id, password);
  redirect("/login");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
