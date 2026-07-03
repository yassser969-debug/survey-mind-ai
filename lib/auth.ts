import "server-only";

import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
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
       WHERE s.token = ? AND s.expires_at > datetime('now')`
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

export function generateVerificationCode(userId: number): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const db = getDb();
  db.prepare(
    "UPDATE email_codes SET consumed_at = datetime('now') WHERE user_id = ? AND consumed_at IS NULL"
  ).run(userId);
  db.prepare(
    "INSERT INTO email_codes (user_id, code, expires_at) VALUES (?, ?, ?)"
  ).run(userId, code, expiresAt.toISOString());

  return code;
}

export function consumeVerificationCode(
  userId: number,
  code: string
): boolean {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id FROM email_codes
       WHERE user_id = ? AND code = ? AND consumed_at IS NULL
         AND expires_at > datetime('now')`
    )
    .get(userId, code.trim()) as { id: number } | undefined;

  if (!row) return false;

  db.prepare(
    "UPDATE email_codes SET consumed_at = datetime('now') WHERE id = ?"
  ).run(row.id);
  db.prepare(
    "UPDATE users SET email_verified_at = datetime('now') WHERE id = ?"
  ).run(userId);

  return true;
}

/**
 * Seeds the admin account (all features) once. Credentials come from
 * ADMIN_EMAIL / ADMIN_PASSWORD env vars, with local defaults for development.
 */
export function ensureAdminAccount(): void {
  const db = getDb();
  const email = process.env.ADMIN_EMAIL ?? "admin@surveymind.local";
  const exists = db
    .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    .get();

  if (exists) return;

  db.prepare(
    `INSERT INTO users (name, email, password_hash, role, email_verified_at)
     VALUES (?, ?, ?, 'admin', datetime('now'))`
  ).run(
    "Administrator",
    email,
    hashPassword(process.env.ADMIN_PASSWORD ?? "admin12345")
  );
}
