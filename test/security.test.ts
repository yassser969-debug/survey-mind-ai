import { beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Point the database at a throwaway directory before importing anything
// that touches it.
process.env.SURVEYMIND_DB_DIR = mkdtempSync(
  path.join(tmpdir(), "surveymind-test-")
);

const { getDb } = await import("@/lib/db");
const { checkRateLimit, clearRateLimit } = await import("@/lib/rate-limit");
const {
  hashPassword,
  verifyPassword,
  verifyPasswordSafe,
  generateVerificationCode,
  consumeVerificationCode,
  resetPassword,
} = await import("@/lib/auth");

function createUser(email: string): number {
  const result = getDb()
    .prepare(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
    )
    .run("Test User", email, hashPassword("password123"));
  return Number(result.lastInsertRowid);
}

beforeAll(() => {
  getDb();
});

describe("rate limiting", () => {
  it("allows up to the limit then blocks", () => {
    for (let i = 0; i < 3; i += 1) {
      expect(checkRateLimit("t:limit", 3, 60)).toBe(true);
    }
    expect(checkRateLimit("t:limit", 3, 60)).toBe(false);
  });

  it("resets after the window expires", () => {
    expect(checkRateLimit("t:window", 1, 60)).toBe(true);
    expect(checkRateLimit("t:window", 1, 60)).toBe(false);

    getDb()
      .prepare("UPDATE rate_limits SET reset_at = ? WHERE key = ?")
      .run(Date.now() - 1000, "t:window");

    expect(checkRateLimit("t:window", 1, 60)).toBe(true);
  });

  it("can be cleared explicitly", () => {
    expect(checkRateLimit("t:clear", 1, 60)).toBe(true);
    expect(checkRateLimit("t:clear", 1, 60)).toBe(false);
    clearRateLimit("t:clear");
    expect(checkRateLimit("t:clear", 1, 60)).toBe(true);
  });
});

describe("passwords", () => {
  it("verifies correct and rejects wrong passwords", () => {
    const hash = hashPassword("secret-password");
    expect(verifyPassword("secret-password", hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("verifyPasswordSafe never passes for unknown accounts", () => {
    expect(verifyPasswordSafe("anything", undefined)).toBe(false);
    const hash = hashPassword("real-password");
    expect(verifyPasswordSafe("real-password", hash)).toBe(true);
    expect(verifyPasswordSafe("wrong", hash)).toBe(false);
  });
});

describe("verification codes", () => {
  it("accepts the right code once and marks the email verified", () => {
    const userId = createUser("verify@test.dev");
    const code = generateVerificationCode(userId, "verify");

    expect(consumeVerificationCode(userId, code, "verify")).toBe(true);
    // A consumed code cannot be replayed.
    expect(consumeVerificationCode(userId, code, "verify")).toBe(false);

    const row = getDb()
      .prepare("SELECT email_verified_at FROM users WHERE id = ?")
      .get(userId) as { email_verified_at: string | null };
    expect(row.email_verified_at).not.toBeNull();
  });

  it("locks the code after 5 wrong attempts", () => {
    const userId = createUser("brute@test.dev");
    const code = generateVerificationCode(userId, "verify");

    for (let i = 0; i < 5; i += 1) {
      expect(consumeVerificationCode(userId, "000000", "verify")).toBe(false);
    }
    // Even the correct code is now rejected.
    expect(consumeVerificationCode(userId, code, "verify")).toBe(false);
  });

  it("keeps verify and reset codes separate", () => {
    const userId = createUser("purpose@test.dev");
    const verifyCode = generateVerificationCode(userId, "verify");
    const resetCode = generateVerificationCode(userId, "reset");

    expect(consumeVerificationCode(userId, verifyCode, "reset")).toBe(false);
    expect(consumeVerificationCode(userId, resetCode, "verify")).toBe(false);
    expect(consumeVerificationCode(userId, resetCode, "reset")).toBe(true);
  });

  it("issuing a new code invalidates the previous one", () => {
    const userId = createUser("rotate@test.dev");
    const oldCode = generateVerificationCode(userId, "verify");
    const newCode = generateVerificationCode(userId, "verify");

    expect(consumeVerificationCode(userId, oldCode, "verify")).toBe(
      oldCode === newCode
    );
    if (oldCode !== newCode) {
      expect(consumeVerificationCode(userId, newCode, "verify")).toBe(true);
    }
  });
});

describe("password reset", () => {
  it("changes the password and kills every session", () => {
    const userId = createUser("reset@test.dev");
    const db = getDb();
    db.prepare(
      "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+1 day'))"
    ).run("token-a", userId);
    db.prepare(
      "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+1 day'))"
    ).run("token-b", userId);

    resetPassword(userId, "brand-new-password");

    const user = db
      .prepare("SELECT password_hash FROM users WHERE id = ?")
      .get(userId) as { password_hash: string };
    expect(verifyPassword("brand-new-password", user.password_hash)).toBe(true);
    expect(verifyPassword("password123", user.password_hash)).toBe(false);

    const sessions = db
      .prepare("SELECT COUNT(*) AS count FROM sessions WHERE user_id = ?")
      .get(userId) as { count: number };
    expect(sessions.count).toBe(0);
  });
});
