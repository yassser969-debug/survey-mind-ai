"use client";

import { useActionState } from "react";
import { submitResponse } from "@/lib/actions/surveys";

export default function AnswerForm({
  surveyId,
  questions,
}: {
  surveyId: string;
  questions: string[];
}) {
  const [state, formAction, pending] = useActionState(submitResponse, null);

  if (state?.ok) {
    return (
      <div className="rounded-[2rem] border border-emerald-300/30 bg-emerald-300/10 p-10 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="mt-4 text-2xl font-black">Thank you!</h2>
        <p className="mt-2 text-slate-300">Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="surveyId" value={surveyId} />

      {questions.map((question, index) => (
        <div
          key={index}
          className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"
        >
          <label className="font-black">
            {index + 1}. {question}
          </label>
          <textarea
            name={`answer-${index}`}
            rows={3}
            placeholder="Your answer…"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
          />
        </div>
      ))}

      {state?.error && (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-bold text-rose-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-6 py-4 font-black shadow-2xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit response"}
      </button>
    </form>
  );
}
