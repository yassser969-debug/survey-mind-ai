import { randomUUID, randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { ensureSchema, sql } from "./db";

const SESSION_COOKIE = "session";

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET must be set in production — refusing to sign sessions with a hardcoded fallback secret.",
  );
}

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-only-secret-change-in-production";

export type User = { id: string; email: string; name: string };

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sign(value: string) {
  const signature = createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
  return `${value}.${signature}`;
}

function unsign(token: string): string | null {
  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const value = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expected = createHmac("sha256", SESSION_SECRET).update(value).digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return value;
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  await ensureSchema();

  const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing) throw new Error("An account with this email already exists.");

  const id = randomUUID();
  await sql`
    INSERT INTO users (id, email, name, password_hash, created_at)
    VALUES (${id}, ${email}, ${name}, ${hashPassword(password)}, ${new Date().toISOString()})
  `;

  return { id, email, name };
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  await ensureSchema();

  const [row] = await sql<{ id: string; email: string; name: string; passwordHash: string }[]>`
    SELECT id, email, name, password_hash as "passwordHash" FROM users WHERE email = ${email}
  `;

  if (!row || !verifyPassword(password, row.passwordHash)) return null;

  return { id: row.id, email: row.email, name: row.name };
}

export async function setSession(user: User) {
  const store = await cookies();
  store.set(SESSION_COOKIE, sign(JSON.stringify(user)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export async function createPasswordResetToken(email: string): Promise<string | null> {
  await ensureSchema();

  const [user] = await sql<{ id: string }[]>`SELECT id FROM users WHERE email = ${email}`;
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

  await sql`
    INSERT INTO password_resets (token, user_id, expires_at, used)
    VALUES (${token}, ${user.id}, ${expiresAt}, 0)
  `;

  return token;
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  await ensureSchema();

  const [row] = await sql<{ userId: string; expiresAt: string; used: number }[]>`
    SELECT user_id as "userId", expires_at as "expiresAt", used FROM password_resets WHERE token = ${token}
  `;

  if (!row || row.used || new Date(row.expiresAt).getTime() < Date.now()) return false;

  await sql`UPDATE users SET password_hash = ${hashPassword(newPassword)} WHERE id = ${row.userId}`;
  await sql`UPDATE password_resets SET used = 1 WHERE token = ${token}`;

  return true;
}

export async function getSession(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const value = unsign(token);
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}
