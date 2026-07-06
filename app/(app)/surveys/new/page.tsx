"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/i18n-client";

type QuestionType = "short" | "long" | "choice" | "rating";

type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
};

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `q-${idCounter}`;
}

function newQuestion(optionLabel: string): Question {
  return { id: nextId(), text: "", type: "short", options: [`${optionLabel} 1`, `${optionLabel} 2`] };
}

export default function SurveyBuilderPage() {
  const router = useRouter();
  const { t } = useLang();
  const typeLabels: Record<QuestionType, string> = {
    short: t.typeShort,
    long: t.typeLong,
    choice: t.typeChoice,
    rating: t.typeRating,
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([newQuestion(t.optionLabel)]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handlePublish() {
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          questions: questions.map(({ text, type, options }) => ({ text, type, options })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not publish the survey.");
        setSaving(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setSaving(false);
    }
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, newQuestion(t.optionLabel)]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => (prev.length > 1 ? prev.filter((q) => q.id !== id) : prev));
  }

  function addOption(id: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [...q.options, `${t.optionLabel} ${q.options.length + 1}`] } : q,
      ),
    );
  }

  function updateOption(id: string, index: number, value: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q,
      ),
    );
  }

  function removeOption(id: string, index: number) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id && q.options.length > 2
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-200">
            {t.surveyBuilder}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{t.buildYourSurvey}</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handlePublish}
            disabled={saving}
            className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-6 py-3 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] disabled:opacity-60"
          >
            {saving ? t.publishing : t.publish}
          </button>
          {error && <p className="text-sm font-semibold text-red-300">{error}</p>}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">
              {t.surveyTitle}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-lg font-black text-white outline-none focus:border-blue-400"
              placeholder={t.untitledSurvey}
            />

            <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-400">
              {t.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-400"
              placeholder={t.tellRespondents}
            />
          </div>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {t.question} {index + 1}
                  </p>
                  <input
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-bold text-white outline-none focus:border-blue-400"
                    placeholder={t.typeYourQuestion}
                  />
                </div>
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-400 hover:border-red-400/40 hover:text-red-300"
                >
                  {t.remove}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(typeLabels) as QuestionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateQuestion(question.id, { type })}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      question.type === type
                        ? "bg-white text-[#050712]"
                        : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25"
                    }`}
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>

              {question.type === "choice" && (
                <div className="mt-5 space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-500" />
                      <input
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-400"
                      />
                      <button
                        onClick={() => removeOption(question.id, optIndex)}
                        className="text-slate-500 hover:text-red-300"
                        aria-label={t.removeOption}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(question.id)}
                    className="text-sm font-bold text-blue-300 hover:text-blue-200"
                  >
                    {t.addOption}
                  </button>
                </div>
              )}

              {question.type === "rating" && (
                <div className="mt-5 flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-black text-slate-400"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full rounded-[2rem] border border-dashed border-white/15 bg-white/[0.02] py-6 text-sm font-black text-slate-300 transition hover:border-blue-400/40 hover:text-white"
          >
            {t.addQuestion}
          </button>
        </div>

        <div className="lg:sticky lg:top-10 lg:h-fit">
          <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
            {t.livePreview}
          </p>
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl backdrop-blur-2xl">
            <div className="max-h-[32rem] overflow-y-auto rounded-[2rem] bg-[#f8fafc] p-6 text-slate-950">
              <h2 className="text-2xl font-black tracking-tight">{title || t.untitledSurvey}</h2>
              {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}

              <div className="mt-6 space-y-5">
                {questions.map((question, index) => (
                  <div key={question.id}>
                    <p className="font-bold">
                      {index + 1}. {question.text || t.untitledQuestion}
                    </p>

                    {question.type === "short" && (
                      <div className="mt-2 h-10 rounded-xl bg-white ring-1 ring-slate-200" />
                    )}
                    {question.type === "long" && (
                      <div className="mt-2 h-20 rounded-xl bg-white ring-1 ring-slate-200" />
                    )}
                    {question.type === "choice" && (
                      <div className="mt-2 space-y-2">
                        {question.options.map((option, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="h-4 w-4 rounded-full ring-1 ring-slate-300" />
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                    {question.type === "rating" && (
                      <div className="mt-2 flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div
                            key={n}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black text-slate-500 ring-1 ring-slate-200"
                          >
                            {n}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full rounded-full bg-slate-950 py-3 text-sm font-black text-white">
                {t.submit}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
