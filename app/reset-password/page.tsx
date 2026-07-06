"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useLang } from "@/lib/i18n-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { t } = useLang();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Could not reset your password.");
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-2xl">
      <h1 className="text-2xl font-black tracking-tight">{t.setNewPassword}</h1>

      {done ? (
        <p className="mt-4 text-sm text-emerald-300">{t.passwordUpdated}</p>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">
              {t.newPassword}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {error && <p className="text-sm font-semibold text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 py-3 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? t.pleaseWait : t.updatePassword}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
