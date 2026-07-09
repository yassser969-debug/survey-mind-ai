import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set — connect a Supabase (or other Postgres) database to this project.",
  );
}

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

export const sql = globalForDb.sql ?? postgres(process.env.DATABASE_URL, { ssl: "prefer" });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS surveys (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id),
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL DEFAULT 'live',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS questions (
          id TEXT PRIMARY KEY,
          survey_id TEXT NOT NULL REFERENCES surveys(id),
          text TEXT NOT NULL,
          type TEXT NOT NULL,
          options TEXT NOT NULL DEFAULT '[]',
          position INTEGER NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS responses (
          id TEXT PRIMARY KEY,
          survey_id TEXT NOT NULL REFERENCES surveys(id),
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS answers (
          id TEXT PRIMARY KEY,
          response_id TEXT NOT NULL REFERENCES responses(id),
          question_id TEXT NOT NULL REFERENCES questions(id),
          value TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS password_resets (
          token TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id),
          expires_at TEXT NOT NULL,
          used INTEGER NOT NULL DEFAULT 0
        )
      `;
    })();
  }

  return schemaReady;
}
