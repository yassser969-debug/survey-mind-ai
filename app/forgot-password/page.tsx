"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n-client";

export default function ForgotPasswordPage() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    setResetUrl(data.resetUrl);
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050712] px-4 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-16rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
            S
          </div>
          <p className="text-base font-black tracking-tight">SurveyMind AI</p>
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-2xl">
          <h1 className="text-2xl font-black tracking-tight">{t.resetPasswordTitle}</h1>
          <p className="mt-2 text-sm text-slate-400">{t.resetPasswordSubtitle}</p>

          {submitted ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-slate-300">
                {t.ifAccountExists} <span className="font-bold">{email}</span>, {t.hereIsResetLink}
              </p>
              {resetUrl ? (
                <Link
                  href={resetUrl}
                  className="block break-all rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-200 hover:border-blue-400/60"
                >
                  {resetUrl}
                </Link>
              ) : (
                <p className="text-sm text-slate-500">{t.noAccountFound}</p>
              )}
              <p className="text-xs text-slate-500">{t.noEmailServiceNote}</p>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {t.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 py-3 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? t.pleaseWait : t.sendResetLink}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            <Link href="/login" className="font-bold text-blue-300 hover:text-blue-200">
              {t.backToSignIn}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
