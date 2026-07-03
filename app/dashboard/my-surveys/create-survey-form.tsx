"use client";

import { useActionState } from "react";
import { createSurvey } from "@/lib/actions/surveys";

export default function CreateSurveyForm() {
  const [state, formAction, pending] = useActionState(createSurvey, null);

  return (
    <form
      action={formAction}
      className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"
    >
      <h2 className="text-xl font-black">Create a new survey</h2>

      <div className="mt-5">
        <label className="text-sm font-bold text-slate-300">Title</label>
        <input
          type="text"
          name="title"
          required
          placeholder="e.g. Course feedback — Semester 1"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-slate-300">
          Questions <span className="text-slate-500">(one per line)</span>
        </label>
        <textarea
          name="questions"
          required
          rows={4}
          placeholder={"How clear were the assessment criteria?\nWhat should we improve first?"}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
        />
      </div>

      {state?.error && (
        <p className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-bold text-rose-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-6 py-3 font-black shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create survey"}
      </button>
    </form>
  );
}
