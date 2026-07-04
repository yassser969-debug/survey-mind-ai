import "server-only";

import { getDb } from "./db";

/**
 * Fixed-window rate limiter backed by SQLite, shared across server
 * instances. Returns false when the caller exceeded `max` hits within
 * the window.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number
): boolean {
  const db = getDb();
  const now = Date.now();

  const row = db
    .prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?")
    .get(key) as { count: number; reset_at: number } | undefined;

  if (!row || row.reset_at < now) {
    db.prepare(
      "INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)"
    ).run(key, now + windowSeconds * 1000);
    return true;
  }

  if (row.count >= max) return false;

  db.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").run(key);
  return true;
}

export function clearRateLimit(key: string): void {
  getDb().prepare("DELETE FROM rate_limits WHERE key = ?").run(key);
}
