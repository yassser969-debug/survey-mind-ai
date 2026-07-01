import Link from "next/link";

const stats = [
  { label: "Total surveys", value: "0" },
  { label: "Responses", value: "0" },
  { label: "AI analyses", value: "0" },
  { label: "Plan", value: "Free" },
];

const quickActions = [
  "Create new survey",
  "Upload Excel file",
  "Analyse responses",
  "Export report",
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-emerald-300 text-lg font-black text-white">
            S
          </div>
          <div>
            <p className="font-black">SurveyMind AI</p>
            <p className="text-sm text-slate-500">Workspace</p>
          </div>
        </Link>

        <nav className="mt-10 space-y-2">
          {["Overview", "Surveys", "Responses", "AI analysis", "Reports", "Settings"].map(
            (item) => (
              <button
                key={item}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                {item}
              </button>
            )
          )}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-black text-blue-200">Free plan</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            3 surveys, 100 responses, and 5 AI analyses included.
          </p>
          <button className="mt-4 w-full rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">
            Upgrade later
          </button>
        </div>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500">Dashboard</p>
              <h1 className="text-2xl font-black tracking-tight">
                Welcome to your workspace
              </h1>
            </div>

            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              Back home
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-8 text-white shadow-2xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-200">
              SurveyMind AI
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.03em] md:text-5xl">
              Start by creating your first survey.
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-300">
              Build a survey, share a public link, collect responses, then use AI
              to understand patterns and prepare clear reports.
            </p>

            <button className="mt-8 rounded-full bg-white px-6 py-3 font-black text-slate-950">
              Create survey
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                <p className="mt-3 text-4xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Recent surveys</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your created surveys will appear here.
                  </p>
                </div>
                <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                  New survey
                </button>
              </div>

              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="text-4xl">📋</p>
                <h4 className="mt-4 text-lg font-black">No surveys yet</h4>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create your first survey to start collecting responses and
                  generating AI insights.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">Quick actions</h3>
              <div className="mt-5 space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}