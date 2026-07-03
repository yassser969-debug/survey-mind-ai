import { getDb } from "@/lib/db";
import AnswerForm from "./answer-form";

export default async function PublicSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const survey = getDb()
    .prepare("SELECT title, questions, status FROM surveys WHERE id = ?")
    .get(id) as
    | { title: string; questions: string; status: string }
    | undefined;

  return (
    <main className="min-h-screen bg-[#050712] px-5 py-12 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute right-[-10rem] bottom-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[130px]" />
      </div>

      <section className="relative mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-base font-black text-[#050712]">
            S
          </span>
          <p className="font-black">SurveyMind AI</p>
        </div>

        {!survey || survey.status !== "active" ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-10 text-center">
            <h1 className="text-2xl font-black">
              This survey is not available
            </h1>
            <p className="mt-3 text-slate-400">
              It may have been closed by its owner or the link is incorrect.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-black tracking-tight">
              {survey.title}
            </h1>
            <p className="mt-2 mb-8 text-slate-400">
              Your answers are anonymous — no account needed.
            </p>
            <AnswerForm
              surveyId={id}
              questions={JSON.parse(survey.questions) as string[]}
            />
          </>
        )}
      </section>
    </main>
  );
}
