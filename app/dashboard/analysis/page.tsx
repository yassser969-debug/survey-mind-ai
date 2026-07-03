import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { AnalysisResult } from "@/lib/analysis";
import AnalyzeButton from "./analyze-button";

type SurveyRow = {
  id: string;
  title: string;
  response_count: number;
};

type AnalysisRow = {
  engine: string;
  result: string;
  response_count: number;
  created_at: string;
};

const sentimentStyles: Record<string, string> = {
  positive: "bg-emerald-300/15 text-emerald-200",
  mixed: "bg-amber-300/15 text-amber-200",
  negative: "bg-rose-300/15 text-rose-200",
  neutral: "bg-slate-400/10 text-slate-300",
};

export default async function AnalysisPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const surveys = db
    .prepare(
      `SELECT s.id, s.title, COUNT(r.id) AS response_count
       FROM surveys s
       LEFT JOIN responses r ON r.survey_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id
       ORDER BY s.created_at DESC`
    )
    .all(user.id) as SurveyRow[];

  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-black tracking-tight">AI analysis</h1>
      <p className="mt-2 text-slate-400">
        Turn your responses into summaries, themes, and practical
        recommendations.
      </p>

      {!aiEnabled && (
        <p className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-200">
          AI engine not connected yet — analyses run in basic statistical mode.
          Add an ANTHROPIC_API_KEY to unlock full AI analysis.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {surveys.length === 0 && (
          <p className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
            Create a survey and collect responses first.
          </p>
        )}

        {surveys.map((survey) => {
          const analyses = db
            .prepare(
              `SELECT engine, result, response_count, created_at
               FROM analyses WHERE survey_id = ?
               ORDER BY id DESC LIMIT 3`
            )
            .all(survey.id) as AnalysisRow[];

          return (
            <section
              key={survey.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{survey.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {survey.response_count} responses · {analyses.length}{" "}
                    analyses
                  </p>
                </div>
                <AnalyzeButton surveyId={survey.id} />
              </div>

              {analyses.map((analysis, index) => {
                const result = JSON.parse(analysis.result) as AnalysisResult;
                return (
                  <div
                    key={index}
                    className="mt-5 rounded-2xl border border-white/10 bg-[#080d1d] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-500">
                        {analysis.created_at} UTC ·{" "}
                        {analysis.engine === "claude"
                          ? "Claude AI"
                          : "Basic statistics"}{" "}
                        · {analysis.response_count} responses
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                          sentimentStyles[result.sentiment] ??
                          sentimentStyles.neutral
                        }`}
                      >
                        {result.sentiment}
                      </span>
                    </div>

                    <p className="mt-4 leading-7 text-slate-200">
                      {result.summary}
                    </p>

                    {result.themes.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-black text-blue-200">
                          Common themes
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {result.themes.map((theme, themeIndex) => (
                            <div
                              key={themeIndex}
                              className="rounded-xl bg-white/[0.04] px-4 py-3"
                            >
                              <p className="text-sm font-bold">{theme.name}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-400">
                                {theme.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.recommendations.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-black text-emerald-200">
                          Recommendations
                        </p>
                        <ul className="mt-3 space-y-2">
                          {result.recommendations.map(
                            (recommendation, recIndex) => (
                              <li
                                key={recIndex}
                                className="flex items-start gap-2 text-sm leading-6 text-slate-300"
                              >
                                <span className="mt-1 text-emerald-300">✓</span>
                                {recommendation}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </main>
  );
}
