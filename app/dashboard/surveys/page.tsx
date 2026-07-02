import Link from "next/link";

const surveyTabs = [
  { name: "All surveys", count: 0, active: true },
  { name: "Drafts", count: 0, active: false },
  { name: "Published", count: 0, active: false },
  { name: "Closed", count: 0, active: false },
];

const templates = [
  {
    title: "Student experience",
    category: "Education",
    questions: "12 questions",
  },
  {
    title: "Course evaluation",
    category: "Teaching",
    questions: "15 questions",
  },
  {
    title: "Research questionnaire",
    category: "Research",
    questions: "20 questions",
  },
];

export default function SurveysPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-black text-blue-600 hover:text-blue-800"
            >
              ← Back to overview
            </Link>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Surveys
            </h1>

            <p className="mt-2 text-slate-500">
              Create, organise, publish, and manage your survey projects.
            </p>
          </div>

          <Link
            href="/dashboard/surveys/new"
            className="rounded-full bg-slate-950 px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-blue-700"
          >
            ＋ Create survey
          </Link>
        </div>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2">
              {surveyTabs.map((tab) => (
                <button
                  key={tab.name}
                  type="button"
                  className={`rounded-full px-4 py-2.5 text-sm font-black transition ${
                    tab.active
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.name}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      tab.active
                        ? "bg-white/15 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                placeholder="Search surveys..."
                className="min-w-64 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
              />

              <select className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 outline-none">
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Most responses</option>
                <option>Alphabetical</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-blue-50 text-4xl text-blue-700">
              ▤
            </div>

            <h2 className="mt-6 text-2xl font-black">
              You have no surveys yet
            </h2>

            <p className="mt-3 max-w-lg leading-7 text-slate-500">
              Create a survey from scratch or begin with a ready-made template.
              Your drafts, published surveys, and response counts will appear
              here.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/surveys/new"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700"
              >
                Create from scratch
              </Link>

              <Link
                href="/dashboard/templates"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Browse templates
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black text-blue-600">
                Suggested templates
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Start with a ready-made structure
              </h2>
            </div>

            <Link
              href="/dashboard/templates"
              className="hidden text-sm font-black text-blue-600 hover:text-blue-800 sm:block"
            >
              View all templates →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {templates.map((template) => (
              <Link
                key={template.title}
                href="/dashboard/surveys/new"
                className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                    {template.category}
                  </span>

                  <span className="text-xs font-bold text-slate-400">
                    {template.questions}
                  </span>
                </div>

                <div className="mt-8 rounded-2xl bg-slate-50 p-4">
                  <div className="h-2 w-4/5 rounded-full bg-slate-300" />
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200" />
                  <div className="mt-3 h-2 w-2/3 rounded-full bg-slate-200" />
                </div>

                <h3 className="mt-6 text-lg font-black">
                  {template.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use this template as a starting point and customise every
                  question.
                </p>

                <p className="mt-5 text-sm font-black text-blue-600">
                  Use template →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}