import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDict, getLang } from "@/lib/i18n";
import { getResponses, getSurvey } from "@/lib/surveys";

export default async function SurveyResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const { id } = await params;
  const result = await getSurvey(id);
  if (!result || result.survey.userId !== user.id) {
    redirect("/dashboard");
  }

  const lang = await getLang();
  const t = getDict(lang);
  const responses = await getResponses(id);
  const questionById = new Map(result.questions.map((q) => [q.id, q.text]));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
            {t.responsesTitle}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            {result.survey.title}
          </h1>
          <p className="mt-2 text-slate-400">
            {responses.length} {t.responsesCollected}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/surveys/${id}/insights`}
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-slate-200 hover:border-white/25"
          >
            {t.aiInsightsNav}
          </Link>
          <a
            href={`/api/surveys/${id}/export?format=csv`}
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-slate-200 hover:border-white/25"
          >
            {t.csvSpssNvivo}
          </a>
          <a
            href={`/api/surveys/${id}/export?format=xlsx`}
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-slate-200 hover:border-white/25"
          >
            {t.excel}
          </a>
          <a
            href={`/api/surveys/${id}/export?format=pdf`}
            className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-5 py-2.5 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
          >
            {t.pdfReport}
          </a>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.05] p-10 text-center text-slate-400">
          {t.noResponsesYet}
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {responses.map((response, index) => (
            <div
              key={response.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-black">
                  {t.responses} {responses.length - index}
                </p>
                <p className="text-sm text-slate-400">
                  {new Date(response.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                {response.answers.map((answer) => (
                  <div key={answer.questionId}>
                    <p className="text-sm font-bold text-slate-400">
                      {questionById.get(answer.questionId) ?? "Unknown question"}
                    </p>
                    <p className="mt-1 text-slate-100">{answer.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
