"use client";

import Link from "next/link";
import { useState } from "react";

const features = [
  {
    title: "Build smarter surveys",
    text: "Create surveys for students, lecturers, researchers, staff, and quality teams with a clean guided flow.",
  },
  {
    title: "Collect responses easily",
    text: "Share one link, collect responses, and keep everything organised in one calm workspace.",
  },
  {
    title: "Analyse with AI",
    text: "Turn raw responses into summaries, themes, patterns, and academic-style insights.",
  },
  {
    title: "Export what matters",
    text: "Prepare reports for Excel, PDF, SPSS, NVivo, and presentations as the platform grows.",
  },
];

const audiences = ["Students", "Lecturers", "Researchers", "Quality teams"];

const plans = [
  {
    name: "Free",
    price: "€0",
    description: "For trying the platform.",
    items: ["3 surveys", "100 responses", "5 AI analyses", "Basic export"],
  },
  {
    name: "Student",
    price: "€4.99/mo",
    description: "For university work and small research projects.",
    items: ["10 surveys", "1,000 responses", "30 AI analyses", "PDF reports planned"],
  },
  {
    name: "Researcher",
    price: "€12.99/mo",
    description: "For deeper analysis and academic reporting.",
    items: ["50 surveys", "5,000 responses", "150 AI analyses", "SPSS & NVivo planned"],
  },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "AR", label: "العربية" },
  { code: "ES", label: "Español" },
];

export default function Home() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  return (
    <main className="min-h-screen bg-[#050712] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute right-[-12rem] top-[14rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[130px]" />
        <div className="absolute bottom-[-14rem] left-[-10rem] h-[36rem] w-[36rem] rounded-full bg-emerald-400/10 blur-[140px]" />
      </div>

      <section className="relative mx-auto min-h-screen max-w-7xl px-6 py-6">
        <nav className="sticky top-6 z-50 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712] shadow-2xl shadow-blue-500/20">
              S
            </div>
            <div>
              <p className="text-base font-black tracking-tight">SurveyMind AI</p>
              <p className="text-xs text-slate-400">AI survey intelligence</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#audience" className="hover:text-white">
              Use cases
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-white/25 sm:block"
              >
                🌐 {selectedLanguage}
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-3 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] p-2 shadow-2xl shadow-black/40">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setLanguageOpen(false);
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-200 hover:bg-white/10"
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#050712] hover:bg-blue-100"
            >
              Start free
            </Link>
          </div>
        </nav>

        <div className="grid min-h-[calc(100vh-96px)] items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Built for feedback, research, and quality improvement
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.05em] md:text-7xl lg:text-8xl">
              Forms are only the start.
              <span className="block bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
                Insights are the goal.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              SurveyMind AI helps users create surveys, collect responses, analyse
              feedback, and turn results into clear reports — without getting lost in
              spreadsheets.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-8 py-4 text-center text-base font-black shadow-2xl shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                Start building free
              </Link>
              <a
                href="#features"
                className="rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-center text-base font-bold text-slate-100 backdrop-blur transition hover:border-white/25"
              >
                Watch product preview
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-3xl font-black">3</p>
                <p className="mt-1 text-sm text-slate-400">Languages planned</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-3xl font-black">AI</p>
                <p className="mt-1 text-sm text-slate-400">Analysis engine</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-3xl font-black">PDF</p>
                <p className="mt-1 text-sm text-slate-400">Reports planned</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-emerald-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[2rem] bg-[#f8fafc] p-5 text-slate-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-500">Workspace</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">
                      Quality Feedback Review
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
                    Live
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Responses", "248"],
                    ["Completion", "86%"],
                    ["AI insights", "12"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <p className="text-sm font-semibold text-slate-500">{label}</p>
                      <p className="mt-2 text-3xl font-black">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="font-black">Feedback signals</p>
                    <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
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
                        <div className="mb-2 flex justify-between text-sm font-bold">
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

                <div className="mt-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                  <p className="text-sm font-black text-blue-700">AI interpretation</p>
                  <p className="mt-2 leading-7 text-slate-700">
                    The responses suggest that users need clearer criteria, faster
                    feedback, and practical recommendations for improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="features" className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
              Platform
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
              One place to create, collect, analyse, and report.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.08]"
              >
                <div className="mb-5 h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-400" />
                <h3 className="text-xl font-black">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="audience" className="py-24">
          <div className="rounded-[3rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur md:p-12">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
                Use cases
              </p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
                Made for people who need answers, not just forms.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {audiences.map((item) => (
                <div key={item} className="rounded-[2rem] bg-[#080d1d] p-7 ring-1 ring-white/10">
                  <p className="text-2xl font-black">{item}</p>
                  <p className="mt-3 leading-7 text-slate-400">
                    Collect feedback, understand responses, and create clearer reports.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-200">
              Pricing
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
              Start free. Upgrade when you need more.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur"
              >
                <p className="text-2xl font-black">{plan.name}</p>
                <p className="mt-3 text-slate-400">{plan.description}</p>
                <p className="mt-7 text-5xl font-black tracking-tight">{plan.price}</p>
                <ul className="mt-7 space-y-3 text-slate-300">
                  {plan.items.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}