import Link from "next/link";

const mainNavigation = [
  {
    name: "Overview",
    description: "Workspace summary",
    icon: "⌂",
    href: "/dashboard",
    active: true,
  },
  {
    name: "Surveys",
    description: "Create and manage surveys",
    icon: "▤",
    href: "/dashboard/surveys",
    active: false,
  },
  {
    name: "Responses",
    description: "Review collected answers",
    icon: "◉",
    href: "/dashboard/responses",
    active: false,
  },
  {
    name: "AI Analysis",
    description: "Themes, patterns, and summaries",
    icon: "✦",
    href: "/dashboard/analysis",
    active: false,
  },
  {
    name: "Reports",
    description: "Build and export reports",
    icon: "▦",
    href: "/dashboard/reports",
    active: false,
  },
  {
    name: "Templates",
    description: "Ready-made survey templates",
    icon: "◇",
    href: "/dashboard/templates",
    active: false,
  },
];

const secondaryNavigation = [
  {
    name: "Subscription",
    icon: "♢",
    href: "/dashboard/subscription",
  },
  {
    name: "Settings",
    icon: "⚙",
    href: "/dashboard/settings",
  },
  {
    name: "Help",
    icon: "?",
    href: "/dashboard/help",
  },
];

const stats = [
  {
    label: "Total surveys",
    value: "0",
    note: "3 available on Free",
    icon: "▤",
  },
  {
    label: "Total responses",
    value: "0",
    note: "100 available on Free",
    icon: "◉",
  },
  {
    label: "AI analyses",
    value: "0",
    note: "5 available on Free",
    icon: "✦",
  },
  {
    label: "Current plan",
    value: "Free",
    note: "Upgrade at any time",
    icon: "♢",
  },
];

const quickActions = [
  {
    title: "Create a survey",
    description: "Start from scratch or use a template",
    icon: "＋",
    href: "/dashboard/surveys/new",
  },
  {
    title: "Explore templates",
    description: "Find a ready-made starting point",
    icon: "◇",
    href: "/dashboard/templates",
  },
  {
    title: "Upload response data",
    description: "Import responses from an Excel file",
    icon: "↑",
    href: "/dashboard/responses/import",
  },
  {
    title: "Create a report",
    description: "Turn findings into a clear report",
    icon: "▦",
    href: "/dashboard/reports/new",
  },
];

const workflow = [
  {
    number: "01",
    title: "Create",
    text: "Build a new survey or choose a template.",
  },
  {
    number: "02",
    title: "Publish",
    text: "Share a public link with participants.",
  },
  {
    number: "03",
    title: "Collect",
    text: "Receive and organise survey responses.",
  },
  {
    number: "04",
    title: "Understand",
    text: "Analyse findings and prepare reports.",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-80 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-emerald-300 text-lg font-black text-white shadow-lg shadow-blue-500/20">
              S
            </div>

            <div>
              <p className="text-base font-black tracking-tight">
                SurveyMind AI
              </p>
              <p className="text-sm text-slate-500">Research workspace</p>
            </div>
          </Link>
        </div>

        <div className="px-5 pt-5">
          <Link
            href="/dashboard/surveys/new"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <span className="text-lg">＋</span>
            Create survey
          </Link>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto px-4 pb-6">
          <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <div className="mt-3 space-y-1.5">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                  item.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-black">{item.name}</span>
                  <span className="block truncate text-xs text-slate-400">
                    {item.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="my-6 border-t border-slate-100" />

          <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Account
          </p>

          <div className="mt-3 space-y-1">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-500">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-slate-100 p-5">
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-blue-200">Free plan</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold">
                Active
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              3 surveys, 100 responses, and 5 AI analyses included.
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[8%] rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" />
            </div>

            <Link
              href="/dashboard/subscription"
              className="mt-4 block w-full rounded-full bg-white px-4 py-2.5 text-center text-sm font-black text-slate-950 transition hover:bg-blue-100"
            >
              View plan
            </Link>
          </div>
        </div>
      </aside>

      <section className="lg:pl-80">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-blue-600">Overview</p>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                Welcome to your workspace
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 sm:block"
              >
                View website
              </Link>

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-black text-slate-700"
                aria-label="Notifications"
              >
                ♢
              </button>

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white"
                aria-label="Account menu"
              >
                YA
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
          <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-7 text-white shadow-2xl shadow-slate-900/15 sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-blue-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Your workspace is ready
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Start with your first survey.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Create a questionnaire, share a public link, collect responses,
                and turn the results into useful insight.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/surveys/new"
                  className="rounded-full bg-white px-6 py-3.5 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-100"
                >
                  Create your first survey
                </Link>

                <Link
                  href="/dashboard/templates"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/10"
                >
                  Browse templates
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-4xl font-black tracking-tight">
                      {stat.value}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 font-black text-slate-600">
                    {stat.icon}
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold text-slate-400">
                  {stat.note}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-7 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-black">Recent surveys</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest survey projects will appear here.
                  </p>
                </div>

                <Link
                  href="/dashboard/surveys"
                  className="text-sm font-black text-blue-600 hover:text-blue-800"
                >
                  View all surveys →
                </Link>
              </div>

              <div className="mt-8 flex min-h-72 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm ring-1 ring-slate-200">
                  ▤
                </div>

                <h4 className="mt-5 text-lg font-black">
                  You have no surveys yet
                </h4>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create your first survey from scratch or begin with a
                  ready-made academic template.
                </p>

                <Link
                  href="/dashboard/surveys/new"
                  className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Create survey
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div>
                <h3 className="text-xl font-black">Quick actions</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Go directly to a common task.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg font-black text-slate-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      {action.icon}
                    </span>

                    <span>
                      <span className="block text-sm font-black text-slate-800">
                        {action.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {action.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-sm font-black text-blue-600">
                Your SurveyMind workflow
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight">
                From a question to a clear report
              </h3>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {workflow.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-xs font-black text-blue-600">
                    {step.number}
                  </p>

                  <h4 className="mt-5 text-lg font-black">{step.title}</h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}