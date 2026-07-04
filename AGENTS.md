<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SurveyMind AI — developer guide

AI survey platform: Next.js 16 (App Router) + Tailwind 4 + SQLite (`better-sqlite3`) + Anthropic SDK. No ORM, no external auth library.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` — ESLint (must stay clean; CI enforces it)
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest unit tests in `test/`

## Conventions

- **Data access**: raw parameterized SQL through `getDb()` in `lib/db.ts`. Never interpolate values into SQL strings. Schema changes go in `lib/db.ts` as `CREATE TABLE IF NOT EXISTS` plus a `PRAGMA table_info` migration for added columns.
- **Mutations**: server actions in `lib/actions/*` with `"use server"`. Every action re-checks auth via `getCurrentUser()` — never trust the client. Actions that take user text must cap lengths with `.slice()` and rate limit via `checkRateLimit()` where abuse is possible.
- **Auth**: DB-backed sessions (httpOnly cookie `sm_session`). Roles: `admin` (founder, seeded from `ADMIN_EMAIL`), `lecturer`, `student`. Role gates live in each page (redirect) and again inside actions.
- **UI**: dark theme (`#050712`), rounded `rounded-[2rem]` cards, `border-white/10 bg-white/[0.05]`, gradient accents blue→violet→emerald. Client components only where interactivity is needed (`useActionState` forms); pages stay server components.
- **Email codes**: 6 digits, 15-minute expiry, 5 wrong attempts lock, purposes `verify` | `reset`. In dev (no `RESEND_API_KEY`) codes render on-screen — keep that behavior gated on the env var.
- **AI**: `lib/analysis.ts` — Claude (`claude-opus-4-8`, structured outputs) when `ANTHROPIC_API_KEY` is set, statistical fallback otherwise. Keep the fallback working.

## Testing

- Unit tests use a temp DB via `SURVEYMIND_DB_DIR` (see `test/security.test.ts`); `server-only` is aliased in `vitest.config.ts`.
- For end-to-end checks, build + `npm start`, then drive with Playwright (`playwright-core` + `/opt/pw-browsers/chromium` in remote sessions).

## Environment variables

See `.env.example`. Everything has a safe dev default; nothing is required to run locally.
