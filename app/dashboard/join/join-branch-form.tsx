"use client";

import { useActionState } from "react";
import { joinBranch } from "@/lib/actions/branch";

export default function JoinBranchForm() {
  const [state, formAction, pending] = useActionState(joinBranch, null);

  return (
    <form
      action={formAction}
      className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"
    >
      <h2 className="text-xl font-black">Join your lecturer&apos;s branch</h2>
      <p className="mt-1 text-sm text-slate-400">
        Enter the 6-character code your lecturer shared with you.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          name="code"
          required
          maxLength={6}
          placeholder="AB12CD"
          className="w-48 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center text-xl font-black uppercase tracking-[0.3em] text-white outline-none placeholder:text-slate-600 focus:border-blue-300"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-6 py-3 font-black shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Joining…" : "Join branch"}
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
