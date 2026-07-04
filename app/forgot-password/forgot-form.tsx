"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function ForgotForm({ t }: { t: Dict["forgot"] }) {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    null
  );

  return (
    <form action={formAction} className="mt-10 space-y-5">
      <div>
        <label className="text-sm font-bold text-slate-300">{t.email}</label>
        <input
          type="email"
          name="email"
          required
          dir="ltr"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
        />
      </div>

      {state?.error && (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-bold text-rose-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="block w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-6 py-4 text-center font-black shadow-2xl shadow-blue-500/25 transition hover:scale-[1.01] disabled:opacity-60"
      >
        {pending ? t.pending : t.button}
      </button>

      <p className="text-center text-sm text-slate-400">
        {t.remembered}{" "}
        <Link href="/login" className="font-bold text-blue-200 hover:text-white">
          {t.signIn}
        </Link>
      </p>
    </form>
  );
}
