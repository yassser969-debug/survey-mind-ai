"use client";

import { useState } from "react";

type Question = {
  id: string;
  text: string;
  type: "short" | "long" | "choice" | "rating";
  options: string[];
};

type Survey = {
  title: string;
  description: string;
};

export default function SurveyRunner({
  surveyId,
  survey,
  questions,
}: {
  surveyId: string;
  survey: Survey;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/surveys/${surveyId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        setError("Could not submit your response. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050712] px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-sm font-black text-[#050712]">
            S
          </div>
          <p className="text-sm font-black text-slate-300">SurveyMind AI</p>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white p-8 text-slate-950 shadow-2xl">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                ✓
              </div>
              <h1 className="text-3xl font-black tracking-tight">Thank you!</h1>
              <p className="mt-3 text-slate-500">
                Your response has been recorded. The team will review it as part of the AI
                analysis for this survey.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="text-3xl font-black tracking-tight">{survey.title}</h1>
              <p className="mt-2 text-slate-500">{survey.description}</p>

              <div className="mt-6 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-8 space-y-7">
                {questions.map((question, index) => (
                  <div key={question.id}>
                    <p className="font-bold">
                      {index + 1}. {question.text}
                    </p>

                    {(question.type === "short" || question.type === "long") && (
                      <textarea
                        required
                        rows={question.type === "long" ? 4 : 1}
                        value={answers[question.id] ?? ""}
                        onChange={(e) => setAnswer(question.id, e.target.value)}
                        className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"
                      />
                    )}

                    {question.type === "choice" && (
                      <div className="mt-3 space-y-2">
                        {question.options.map((option) => (
                          <label
                            key={option}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              answers[question.id] === option
                                ? "border-blue-400 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              required
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={(e) => setAnswer(question.id, e.target.value)}
                              className="h-4 w-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === "rating" && (
                      <div className="mt-3 flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            type="button"
                            key={n}
                            onClick={() => setAnswer(question.id, String(n))}
                            className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black transition ${
                              answers[question.id] === String(n)
                                ? "bg-slate-950 text-white"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {error && <p className="mt-6 text-sm font-semibold text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-9 w-full rounded-full bg-slate-950 py-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit response"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
