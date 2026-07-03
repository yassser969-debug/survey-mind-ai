"use client";

import { useActionState } from "react";
import { createBranch } from "@/lib/actions/branch";

export default function CreateBranchForm() {
  const [state, formAction, pending] = useActionState(createBranch, null);

  return (
    <form
      action={formAction}
      className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"
    >
      <h2 className="text-xl font-black">Open a new branch</h2>
      <p className="mt-1 text-sm text-slate-400">
        A branch groups your students so you can follow their surveys.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          name="name"
          required
          placeholder="e.g. Research Methods — Group A"
          className="min-w-64 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-6 py-3 font-black shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create branch"}
        </button>
      </div>

      {state?.error && (
        <p className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-bold text-rose-200">
          {state.error}
        </p>
      )}
    </form>
  );
}
