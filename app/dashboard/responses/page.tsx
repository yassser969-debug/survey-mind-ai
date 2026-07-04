import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDict } from "@/lib/i18n";

type ResponseRow = {
  id: number;
  answers: string;
  submitted_at: string;
  survey_title: string;
  questions: string;
};

export default async function ResponsesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = (await getDict()).responses;
  const db = getDb();

  const stats = db
    .prepare(
      `SELECT COUNT(r.id) AS total,
              COUNT(DISTINCT r.survey_id) AS surveys_with_responses
       FROM responses r
       JOIN surveys s ON s.id = r.survey_id
       WHERE s.owner_id = ?`
    )
    .get(user.id) as { total: number; surveys_with_responses: number };

  const responses = db
    .prepare(
      `SELECT r.id, r.answers, r.submitted_at, s.title AS survey_title,
              s.questions
       FROM responses r
       JOIN surveys s ON s.id = r.survey_id
       WHERE s.owner_id = ?
       ORDER BY r.id DESC
       LIMIT 100`
    )
    .all(user.id) as ResponseRow[];

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>
      <p className="mt-2 text-slate-400">{t.subtitle}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-sm font-bold text-slate-400">{t.total}</p>
          <p className="mt-2 text-4xl font-black">{stats.total}</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-sm font-bold text-slate-400">
            {t.surveysReceiving}
          </p>
          <p className="mt-2 text-4xl font-black">
            {stats.surveys_with_responses}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {responses.length === 0 && (
          <p className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
            {t.empty}
          </p>
        )}

        {responses.map((response) => {
          const questions = JSON.parse(response.questions) as string[];
          const answers = JSON.parse(response.answers) as string[];
          return (
            <details
              key={response.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5"
            >
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                <span className="font-black">{response.survey_title}</span>
                <span dir="ltr" className="text-xs font-bold text-slate-500">
                  #{response.id} · {response.submitted_at} UTC
                </span>
              </summary>
              <ul className="mt-4 space-y-3">
                {questions.map((question, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-bold text-slate-300">{question}</span>
                    <span className="block leading-6 text-slate-400">
                      {answers[index] || "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </main>
  );
}
