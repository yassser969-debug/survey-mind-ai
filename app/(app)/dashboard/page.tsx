import Link from "next/link";

const stats = [
  { label: "Active surveys", value: "6" },
  { label: "Total responses", value: "1,248" },
  { label: "Avg. completion", value: "82%" },
  { label: "AI analyses run", value: "34" },
];

const surveys = [
  {
    id: "quality-feedback-review",
    name: "Quality Feedback Review",
    status: "Live",
    responses: 248,
    completion: "86%",
    updated: "2h ago",
  },
  {
    id: "course-experience-survey",
    name: "Course Experience Survey",
    status: "Live",
    responses: 512,
    completion: "79%",
    updated: "1d ago",
  },
  {
    id: "staff-wellbeing-check",
    name: "Staff Wellbeing Check",
    status: "Draft",
    responses: 0,
    completion: "—",
    updated: "3d ago",
  },
  {
    id: "research-participant-intake",
    name: "Research Participant Intake",
    status: "Closed",
    responses: 488,
    completion: "94%",
    updated: "1w ago",
  },
];

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Closed: "bg-slate-200 text-slate-600",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
            Workspace
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Good to see you back.
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
            View all
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {surveys.map((survey) => (
            <Link
              key={survey.id}
              href={`/s/${survey.id}`}
              className="flex flex-col gap-4 p-6 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold">{survey.name}</p>
                <p className="mt-1 text-sm text-slate-400">Updated {survey.updated}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <span className={`rounded-full px-3 py-1 font-black ${statusStyles[survey.status]}`}>
                  {survey.status}
                </span>
                <div className="text-right">
                  <p className="font-black">{survey.responses}</p>
                  <p className="text-slate-400">responses</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{survey.completion}</p>
                  <p className="text-slate-400">completion</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
