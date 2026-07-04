"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/lib/actions/auth";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function SignupForm({ t }: { t: Dict["signup"] }) {
  const [state, formAction, pending] = useActionState(signup, null);
  const [role, setRole] = useState("student");

  const roles = [
    { value: "student", icon: "🎓", title: t.studentTitle, desc: t.studentDesc },
    { value: "lecturer", icon: "🏛️", title: t.lecturerTitle, desc: t.lecturerDesc },
  ];

  return (
    <form action={formAction} className="mt-10 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map((option) => (
          <button
            type="button"
            key={option.value}
            onClick={() => setRole(option.value)}
            className={`rounded-2xl border p-4 text-start transition ${
              role === option.value
                ? "border-blue-300/60 bg-blue-400/10"
                : "border-white/10 bg-white/[0.04] hover:border-white/25"
            }`}
          >
            <p className="font-black">
              {option.icon} {option.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {option.desc}
            </p>
          </button>
        ))}
      </div>
      <input type="hidden" name="role" value={role} />

      <div>
        <label className="text-sm font-bold text-slate-300">{t.name}</label>
        <input
          type="text"
          name="name"
          required
          placeholder={t.namePh}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-300">{t.email}</label>
        <input
          type="email"
          name="email"
          required
          dir="ltr"
          placeholder={t.emailPh}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-slate-300">
            {t.password}
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder={t.passwordPh}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-300">
            {t.confirm}
          </label>
          <input
            type="password"
            name="confirm"
            required
            minLength={8}
            placeholder={t.confirmPh}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
          />
        </div>
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
        {t.haveAccount}{" "}
        <Link href="/login" className="font-bold text-blue-200 hover:text-white">
          {t.signIn}
        </Link>
      </p>
    </form>
  );
}
