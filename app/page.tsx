export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <section className="relative min-h-screen px-6 py-6">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-500/30 blur-[120px]" />
          <div className="absolute right-[-8%] top-[20%] h-[420px] w-[420px] rounded-full bg-violet-500/25 blur-[130px]" />
          <div className="absolute bottom-[-12%] left-[25%] h-[360px] w-[360px] rounded-full bg-emerald-400/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/7 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-emerald-300 text-xl font-black shadow-lg shadow-blue-500/20">
                S
              </div>

              <div>
                <p className="text-lg font-black tracking-tight">
                  SurveyMind AI
                </p>
                <p className="text-xs text-slate-300">
                  Calm survey intelligence
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
              <a className="transition hover:text-white" href="#features">
                Features
              </a>
              <a className="transition hover:text-white" href="#audience">
                For who?
              </a>
              <a className="transition hover:text-white" href="#pricing">
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-300/60 hover:text-white sm:block">
                🌐 EN
              </button>

              <button className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-blue-100">
                Start free
              </button>
            </div>
          </nav>

          <div className="grid min-h-[calc(100vh-96px)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-7 inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-100">
                Built for students, lecturers, researchers, and quality teams
              </div>

              <h1 className="max-w-5xl text-5xl font-black leading-[1.02] tracking-[-0.04em] md:text-7xl">
                Collect feedback.
                <span className="block bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
                  Understand it faster.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                SurveyMind AI helps people create surveys, collect responses,
                analyse feedback, and turn results into clear insights without
                feeling lost in spreadsheets.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-8 py-4 text-base font-black text-white shadow-2xl shadow-blue-500/25 transition hover:scale-[1.02]">
                  Start building now
                </button>

                <button className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-slate-100 backdrop-blur transition hover:border-emerald-200/50">
                  See how it works
                </button>
              </div>

              <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur">
                  <p className="text-3xl font-black">3</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Free surveys to start
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur">
                  <p className="text-3xl font-black">AI</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Clear summaries
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur">
                  <p className="text-3xl font-black">3</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Languages planned
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-500/30 via-violet-500/20 to-emerald-400/20 blur-3xl" />

              <div className="relative rounded-[2.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
                <div className="rounded-[2rem] bg-[#f8fafc] p-5 text-slate-950">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Live product preview
                      </p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight">
                        Course Feedback Survey
                      </h2>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">Responses</p>
                      <p className="mt-2 text-3xl font-black">248</p>
                    </div>

                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">Completion</p>
                      <p className="mt-2 text-3xl font-black">86%</p>
                    </div>

                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">AI insights</p>
                      <p className="mt-2 text-3xl font-black">12</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                      <p className="font-black">Top themes</p>
                      <p className="text-sm font-semibold text-blue-600">
                        AI summary
                      </p>
                    </div>

                    <div className="space-y-5">
                      {[
                        ["Assessment clarity", "78%", "w-[78%]", "bg-blue-500"],
                        ["Feedback quality", "64%", "w-[64%]", "bg-violet-500"],
                        ["Learning support", "52%", "w-[52%]", "bg-emerald-500"],
                      ].map(([label, value, width, color]) => (
                        <div key={label}>
                          <div className="mb-2 flex justify-between text-sm font-semibold">
                            <span>{label}</span>
                            <span>{value}</span>
                          </div>
                          <div className="h-3 rounded-full bg-slate-100">
                            <div className={`h-3 rounded-full ${width} ${color}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-sm font-bold text-blue-700">
                      AI interpretation
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      Students appear to value clearer assessment criteria,
                      timely feedback, and practical learning support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="features" className="py-20">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">
                Features
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                One calm place for surveys, feedback, and analysis.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Create surveys", "Build simple or academic surveys without starting from zero."],
                ["Collect responses", "Share a link and collect answers from students, staff, or teams."],
                ["Analyse with AI", "Turn results into clear summaries and useful recommendations."],
                ["Export reports", "Prepare for Excel, PDF, SPSS, NVivo, and slides in future releases."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-[2rem] border border-white/10 bg-white/7 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="audience" className="py-20">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-200">
                Who it helps
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                Designed for people who need answers, not just forms.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                "Students",
                "Lecturers",
                "Researchers",
                "Quality teams",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[2rem] border border-white/10 bg-white/7 p-7 backdrop-blur"
                >
                  <p className="text-2xl font-black">{item}</p>
                  <p className="mt-3 leading-7 text-slate-300">
                    Create, collect, analyse, and explain feedback in a clearer way.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="pricing" className="py-20">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-violet-200">
                Pricing
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                Start free. Upgrade when you need more.
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {[
                ["Free", "€0", ["3 surveys", "100 responses", "5 AI analyses", "Basic exports"]],
                ["Student", "€4.99/mo", ["10 surveys", "1,000 responses", "30 AI analyses", "PDF reports planned"]],
                ["Researcher", "€12.99/mo", ["50 surveys", "5,000 responses", "150 AI analyses", "SPSS and NVivo planned"]],
              ].map(([name, price, items]) => (
                <div
                  key={name as string}
                  className="rounded-[2rem] border border-white/10 bg-white/7 p-7 backdrop-blur"
                >
                  <p className="text-2xl font-black">{name}</p>
                  <p className="mt-4 text-4xl font-black">{price}</p>
                  <ul className="mt-6 space-y-3 text-slate-300">
                    {(items as string[]).map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}