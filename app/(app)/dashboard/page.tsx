import Link from "next/link";
import { getSession } from "@/lib/auth";
import { listSurveysForUser } from "@/lib/surveys";

const statusStyles: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  closed: "bg-slate-200 text-slate-600",
};

export default async function DashboardPage() {
  const user = await getSession();
  const surveys = user ? listSurveysForUser(user.id) : [];

  const totalResponses = surveys.reduce((sum, s) => sum + s.responseCount, 0);
  const liveCount = surveys.filter((s) => s.status === "live").length;
  const avgCompletion = surveys.length
    ? Math.round(surveys.reduce((sum, s) => sum + s.completion, 0) / surveys.length)
    : 0;

  const stats = [
    { label: "Active surveys", value: String(liveCount) },
    { label: "Total responses", value: totalResponses.toLocaleString() },
    { label: "Avg. completion", value: `${avgCompletion}%` },
    { label: "Surveys created", value: String(surveys.length) },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
            Workspace
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Good to see you back{user ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-2 text-slate-400">
            Here&apos;s what&apos;s happening across your surveys today.
          </p>
        </div>
        <Link
          href="/surveys/new"
          className="w-fit rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-6 py-3 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
        >
          + New survey
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
          >
            <p className="text-sm font-semibold text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="text-xl font-black">Your surveys</h2>
          <Link href="/surveys/new" className="text-sm font-bold text-blue-300 hover:text-blue-200">
            + New survey
          </Link>
        </div>

        {surveys.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <p>You haven&apos;t created any surveys yet.</p>
            <Link href="/surveys/new" className="mt-3 inline-block font-bold text-blue-300 hover:text-blue-200">
              Build your first survey →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link href={`/s/${survey.id}`} className="font-bold hover:text-blue-300">
                    {survey.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-400">
                    Updated {new Date(survey.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <span className={`rounded-full px-3 py-1 font-black ${statusStyles[survey.status]}`}>
                    {survey.status}
                  </span>
                  <div className="text-right">
                    <p className="font-black">{survey.responseCount}</p>
                    <p className="text-slate-400">responses</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black">{survey.completion}%</p>
                    <p className="text-slate-400">completion</p>
                  </div>
                  <Link
                    href={`/surveys/${survey.id}/insights`}
                    className="rounded-full border border-white/10 px-4 py-2 font-bold text-slate-200 hover:border-blue-400/40 hover:text-white"
                  >
                    AI insights
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
