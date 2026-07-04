import "server-only";

import { cookies } from "next/headers";
import { randomBytes, randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

export type Role = "admin" | "student" | "lecturer";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  emailVerifiedAt: string | null;
};

const SESSION_COOKIE = "sm_session";
const SESSION_DAYS = 30;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// Compared against when the account does not exist, so login takes the
// same time either way and attackers cannot probe which emails are registered.
const DUMMY_HASH = bcrypt.hashSync("timing-equalizer-placeholder", 10);

export function verifyPasswordSafe(
  password: string,
  hash: string | undefined
): boolean {
  return bcrypt.compareSync(password, hash ?? DUMMY_HASH) && hash !== undefined;
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  );

  getDb()
    .prepare(
      "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"
    )
    .run(token, userId, expiresAt.toISOString());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.email_verified_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')
         AND u.banned_at IS NULL`
    )
    .get(token) as
    | {
        id: number;
        name: string;
        email: string;
        role: Role;
        email_verified_at: string | null;
      }
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    emailVerifiedAt: row.email_verified_at,
  };
}

export type CodePurpose = "verify" | "reset";

const MAX_CODE_ATTEMPTS = 5;

export function generateVerificationCode(
  userId: number,
  purpose: CodePurpose = "verify"
): string {
  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const db = getDb();
  db.prepare(
    "UPDATE email_codes SET consumed_at = datetime('now') WHERE user_id = ? AND purpose = ? AND consumed_at IS NULL"
  ).run(userId, purpose);
  db.prepare(
    "INSERT INTO email_codes (user_id, code, purpose, expires_at) VALUES (?, ?, ?, ?)"
  ).run(userId, code, purpose, expiresAt.toISOString());

  return code;
}

export function consumeVerificationCode(
  userId: number,
  code: string,
  purpose: CodePurpose = "verify"
): boolean {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, code, attempts FROM email_codes
       WHERE user_id = ? AND purpose = ? AND consumed_at IS NULL
         AND expires_at > datetime('now')
       ORDER BY id DESC LIMIT 1`
    )
    .get(userId, purpose) as
    | { id: number; code: string; attempts: number }
    | undefined;

  if (!row || row.attempts >= MAX_CODE_ATTEMPTS) return false;

  if (row.code !== code.trim()) {
    db.prepare(
      "UPDATE email_codes SET attempts = attempts + 1 WHERE id = ?"
    ).run(row.id);
    return false;
  }

  db.prepare(
    "UPDATE email_codes SET consumed_at = datetime('now') WHERE id = ?"
  ).run(row.id);

  if (purpose === "verify") {
    db.prepare(
      "UPDATE users SET email_verified_at = datetime('now') WHERE id = ?"
    ).run(userId);
  }

  return true;
}

/** Updates the password and signs the user out of every device. */
export function resetPassword(userId: number, newPassword: string): void {
  const db = getDb();
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    hashPassword(newPassword),
    userId
  );
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

/** The platform founder — the one account with every capability. */
export const FOUNDER_EMAIL = (
  process.env.ADMIN_EMAIL ?? "yassser969@gmail.com"
).toLowerCase();

/**
 * Seeds the founder account (all features) once, and promotes the founder
 * email to admin if it already exists as a regular account. The password
 * comes from ADMIN_PASSWORD, with a local default for development.
 */
export function ensureAdminAccount(): void {
  const db = getDb();

  const existing = db
    .prepare("SELECT id, role FROM users WHERE email = ?")
    .get(FOUNDER_EMAIL) as { id: number; role: string } | undefined;

  if (existing) {
    if (existing.role !== "admin") {
      db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(
        existing.id
      );
    }
    return;
  }

  db.prepare(
    `INSERT INTO users (name, email, password_hash, role, email_verified_at)
     VALUES (?, ?, ?, 'admin', datetime('now'))`
  ).run(
    "Founder",
    FOUNDER_EMAIL,
    hashPassword(process.env.ADMIN_PASSWORD ?? "admin12345")
  );
}
