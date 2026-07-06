import { randomUUID, randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "session";
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

export function createUser(email: string, name: string, password: string): User {
  const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email);
  if (existing) throw new Error("An account with this email already exists.");

  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, email, name, hashPassword(password), new Date().toISOString());

  return { id, email, name };
}

export function verifyCredentials(email: string, password: string): User | null {
  const row = db
    .prepare(`SELECT id, email, name, password_hash as passwordHash FROM users WHERE email = ?`)
    .get(email) as (User & { passwordHash: string }) | undefined;

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
