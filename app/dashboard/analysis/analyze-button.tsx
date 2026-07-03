"use client";

import { useActionState } from "react";
import { analyzeSurvey } from "@/lib/actions/analysis";

export default function AnalyzeButton({ surveyId }: { surveyId: string }) {
  const [state, formAction, pending] = useActionState(analyzeSurvey, null);

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="surveyId" value={surveyId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-5 py-2.5 text-sm font-black shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Analysing…" : "✦ Run AI analysis"}
      </button>
      {state?.error && (
        <p className="text-sm font-bold text-rose-200">{state.error}</p>
      )}
    </form>
  );
}
