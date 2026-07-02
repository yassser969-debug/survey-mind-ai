import Link from "next/link";

const filters = ["All responses", "Completed", "In progress", "Flagged"];

const stats = [
  { label: "Total responses", value: "0", accent: "bg-blue-50 text-blue-700" },
  { label: "Completed", value: "0", accent: "bg-emerald-50 text-emerald-700" },
  { label: "In progress", value: "0", accent: "bg-violet-50 text-violet-700" },
  { label: "Completion rate", value: "0%", accent: "bg-slate-100 text-slate-700" },
];

export default function ResponsesPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-black text-blue-600 hover:text-blue-800"
            >
              ← Back to dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Responses
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Review submitted answers, track progress, and prepare response data
              for analysis with a clear and organised workflow.
            </p>
          </div>

          <Link
            href="/dashboard/responses/import"
            className="rounded-full bg-slate-950 px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-blue-700"
          >
            ＋ Import responses
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className={`inline-flex rounded-full px-3 py-1.5 text-sm font-black ${stat.accent}`}>
                {stat.label}
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-full px-4 py-2.5 text-sm font-black transition ${
                    index === 0
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                placeholder="Search responses"
                className="min-w-64 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
              />

              <select className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 outline-none">
                <option>All surveys</option>
                <option>Student experience</option>
                <option>Course evaluation</option>
              </select>

              <select className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 outline-none">
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Most complete</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="text-left text-sm font-black text-slate-500">
                  <th className="px-4 py-3">Select</th>
                  <th className="px-4 py-3">Survey</th>
                  <th className="px-4 py-3">Respondent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={6} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-blue-50 text-4xl text-blue-700">
                        ◉
                      </div>

                      <h2 className="mt-6 text-2xl font-black">
                        No responses yet
                      </h2>

                      <p className="mt-3 max-w-lg leading-7 text-slate-500">
                        Responses will appear here as soon as participants start
                        completing your surveys. You can also import existing data
                        from a spreadsheet.
                      </p>

                      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href="/dashboard/surveys"
                          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                        >
                          Go to surveys
                        </Link>

                        <Link
                          href="/dashboard/responses/import"
                          className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          Import responses
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-emerald-600">
                  Response quality checks
                </p>
                <h2 className="mt-2 text-xl font-black">
                  Keep submissions clean and reliable
                </h2>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-700">
                Ready
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                • Review incomplete responses and identify drop-off points.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                • Flag low-quality or suspicious submissions for follow-up.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                • Compare engagement trends across your active surveys.
              </div>
            </div>
          </section>

          <Link
            href="/dashboard/analysis"
            className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-6 text-white shadow-sm transition hover:-translate-y-0.5"
          >
            <p className="text-sm font-black text-blue-200">AI analysis</p>
            <h2 className="mt-2 text-xl font-black">
              Turn responses into actionable insights
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Summarise themes, spot patterns, and share highlights with your
              team once responses start arriving.
            </p>
            <p className="mt-6 text-sm font-black text-white">
              Open AI analysis →
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
