"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resendCode, verifyEmail } from "@/lib/actions/auth";

export default function VerifyForm({
  email,
  devCode,
}: {
  email: string;
  devCode: string | null;
}) {
  const [state, formAction, pending] = useActionState(verifyEmail, null);
  const [resendState, resendAction, resending] = useActionState(
    resendCode,
    null
  );

  return (
    <main className="min-h-screen bg-[#050712] px-6 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute right-[-10rem] bottom-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[130px]" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl md:p-12">
          <Link href="/" className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
              S
            </div>
            <div>
              <p className="font-black">SurveyMind AI</p>
              <p className="text-sm text-slate-400">AI survey intelligence</p>
            </div>
          </Link>

          <h1 className="text-4xl font-black tracking-[-0.03em]">
            Check your email
          </h1>
          <p className="mt-3 leading-7 text-slate-400">
            We sent a 6-digit verification code to{" "}
            <span className="font-bold text-white">{email}</span>. Enter it
            below to activate your account.
          </p>

          {devCode && (
            <p className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-200">
              Development mode (no email provider configured) — your code is:{" "}
              <span className="text-lg tracking-[0.3em]">{devCode}</span>
            </p>
          )}

          <form action={formAction} className="mt-8 space-y-5">
            <input type="hidden" name="email" value={email} />

            <div>
              <label className="text-sm font-bold text-slate-300">
                Verification code
              </label>
              <input
                type="text"
                name="code"
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="123456"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center text-2xl font-black tracking-[0.5em] text-white outline-none placeholder:text-slate-600 focus:border-blue-300"
              />
            </div>

            {state?.error && (
              <p className="rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-bold text-rose-200">
                {state.error}
              </p>
            )}
            {resendState?.error && (
              <p className="rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-bold text-rose-200">
                {resendState.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="block w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-6 py-4 text-center font-black shadow-2xl shadow-blue-500/25 transition hover:scale-[1.01] disabled:opacity-60"
            >
              {pending ? "Verifying…" : "Verify email"}
            </button>
          </form>

          <form action={resendAction} className="mt-4">
            <input type="hidden" name="email" value={email} />
            <button
              type="submit"
              disabled={resending}
              className="w-full text-center text-sm font-bold text-blue-200 transition hover:text-white disabled:opacity-60"
            >
              {resending ? "Sending a new code…" : "Resend code"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
