import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { activateSurvey, closeSurvey } from "@/lib/actions/surveys";
import { collectionDuration } from "@/lib/format";
import CreateSurveyForm from "./create-survey-form";

type SurveyRow = {
  id: string;
  title: string;
  questions: string;
  status: "draft" | "active" | "closed";
  created_at: string;
  activated_at: string | null;
  closed_at: string | null;
  response_count: number;
};

const statusStyles: Record<SurveyRow["status"], string> = {
  draft: "bg-slate-400/10 text-slate-300",
  active: "bg-emerald-300/15 text-emerald-200",
  closed: "bg-rose-300/10 text-rose-200",
};

export default async function MySurveysPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const surveys = getDb()
    .prepare(
      `SELECT s.*, COUNT(r.id) AS response_count
       FROM surveys s
       LEFT JOIN responses r ON r.survey_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id
       ORDER BY s.created_at DESC`
    )
    .all(user.id) as SurveyRow[];

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-black tracking-tight">My surveys</h1>
      <p className="mt-2 text-slate-400">
        Create a survey, activate it to start collecting, and share its link.
      </p>

      <div className="mt-8">
        <CreateSurveyForm />
      </div>

      <div className="mt-8 space-y-5">
        {surveys.length === 0 && (
          <p className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
            No surveys yet — create your first one above.
          </p>
        )}

        {surveys.map((survey) => {
          const questions = JSON.parse(survey.questions) as string[];
          const responses = getDb()
            .prepare(
              "SELECT answers, submitted_at FROM responses WHERE survey_id = ? ORDER BY id DESC"
            )
            .all(survey.id) as { answers: string; submitted_at: string }[];

          return (
            <div
              key={survey.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{survey.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {questions.length} questions · {survey.response_count}{" "}
                    responses · collecting for{" "}
                    {collectionDuration(survey.activated_at, survey.closed_at)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusStyles[survey.status]}`}
                >
                  {survey.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {survey.status !== "active" ? (
                  <form action={activateSurvey}>
                    <input type="hidden" name="surveyId" value={survey.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-emerald-400/90 px-5 py-2 text-sm font-black text-[#04140c] transition hover:bg-emerald-300"
                    >
                      {survey.status === "draft" ? "Activate" : "Reopen"}
                    </button>
                  </form>
                ) : (
                  <form action={closeSurvey}>
                    <input type="hidden" name="surveyId" value={survey.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-rose-300/40 px-5 py-2 text-sm font-black text-rose-200 transition hover:bg-rose-400/10"
                    >
                      Close collection
                    </button>
                  </form>
                )}

                {survey.status === "active" && (
                  <code className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-blue-200">
                    /s/{survey.id}
                  </code>
                )}
              </div>

              {responses.length > 0 && (
                <details className="mt-5 rounded-2xl border border-white/10 bg-[#080d1d] p-4">
                  <summary className="cursor-pointer font-black text-slate-200">
                    View {responses.length} responses
                  </summary>
                  <div className="mt-4 space-y-4">
                    {responses.map((response, responseIndex) => {
                      const answers = JSON.parse(response.answers) as string[];
                      return (
                        <div
                          key={responseIndex}
                          className="rounded-2xl bg-white/[0.04] p-4"
                        >
                          <p className="text-xs font-bold text-slate-500">
                            {response.submitted_at} UTC
                          </p>
                          <ul className="mt-2 space-y-2">
                            {questions.map((question, questionIndex) => (
                              <li key={questionIndex} className="text-sm">
                                <span className="font-bold text-slate-300">
                                  {question}
                                </span>
                                <span className="block text-slate-400">
                                  {answers[questionIndex] || "—"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
