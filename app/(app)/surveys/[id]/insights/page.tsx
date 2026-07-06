"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLang } from "@/lib/i18n-client";

export default function SurveyInsightsPage() {
  const params = useParams<{ id: string }>();
  const { t } = useLang();
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setError("");
    setSummary("");
    setLoading(true);

    try {
      const res = await fetch(`/api/surveys/${params.id}/analyze`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not run AI analysis.");
        setLoading(false);
        return;
      }

      setSummary(data.summary);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
        {t.aiInsightsNav}
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
        {t.understandResponses}
      </h1>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-6 py-3 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? t.analyzing : t.runAiAnalysis}
        </button>
        <a
          href={`/api/surveys/${params.id}/export?format=csv`}
          className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-bold text-slate-200 hover:border-white/25"
        >
          {t.csvSpssNvivo}
        </a>
        <a
          href={`/api/surveys/${params.id}/export?format=xlsx`}
          className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-bold text-slate-200 hover:border-white/25"
        >
          {t.excel}
        </a>
        <a
          href={`/api/surveys/${params.id}/export?format=pdf`}
          className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-bold text-slate-200 hover:border-white/25"
        >
          {t.pdfReport}
        </a>
      </div>

      {error && (
        <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-500/[0.06] p-6 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur">
          <p className="mb-4 text-sm font-black text-blue-300">{t.aiSummary}</p>
          <div className="whitespace-pre-wrap leading-7 text-slate-200">{summary}</div>
        </div>
      )}
    </div>
  );
}
