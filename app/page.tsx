import Link from "next/link";
import { getDict, getLang } from "@/lib/i18n";
import LanguageToggle from "./language-toggle";

const audienceIcons = [
  // graduation cap — students
  <path
    key="students"
    d="m3 9 9-4 9 4-9 4-9-4Z M7 11v4.5c0 1.5 2.5 3 5 3s5-1.5 5-3V11 M21 9v6"
  />,
  // presentation board — lecturers
  <path
    key="lecturers"
    d="M3 4h18 M4 4v11h7 M9 19h6 M12 15v4 M14 7.5l2 2 3.5-3.5"
  />,
  // magnifier — researchers
  <path
    key="researchers"
    d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z M16.2 16.2 21 21 M9 11h4 M11 9v4"
  />,
  // shield check — quality teams
  <path
    key="quality"
    d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-2.5Z M9.3 12l1.9 1.9 3.6-3.9"
  />,
];

const featureIcons = [
  // document with a pencil — build
  <path
    key="build"
    d="M9 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M9 8.5h6 M9 12h4 M14.5 15.5 16 14l1.5 1.5L16 17l-1.5-1.5Z"
  />,
  // link — collect
  <path
    key="collect"
    d="M9.5 14.5 14.5 9.5 M8.8 15.7 6.6 17.9a3 3 0 0 1-4.2-4.2l2.6-2.6a3 3 0 0 1 4.2 0 M15.2 8.3l2.2-2.2a3 3 0 0 1 4.2 4.2l-2.6 2.6a3 3 0 0 1-4.2 0"
  />,
  // sparkle chart — analyse
  <path
    key="analyse"
    d="M4 19V10 M9.5 19V5 M15 19v-7 M20 19V8 M18 4l.7 1.6L20.3 6l-1.6.7L18 8.3l-.7-1.6L15.7 6l1.6-.7Z"
  />,
  // export tray
  <path
    key="export"
    d="M12 3v11 M8 10l4 4 4-4 M4 17.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"
  />,
];

export default async function Home() {
  const lang = await getLang();
  const t = getDict(lang);

  const features = t.featureTitles.map((title, i) => ({
    title,
    text: t.featureTexts[i],
    icon: featureIcons[i],
  }));

  const plans = [
    {
      name: "Free",
      price: "€0",
      description: lang === "ar" ? "لتجربة المنصة." : "For trying the platform.",
      items:
        lang === "ar"
          ? ["3 استبيانات", "100 رد", "5 تحليلات AI", "تصدير أساسي"]
          : ["3 surveys", "100 responses", "5 AI analyses", "Basic export"],
      popular: false,
    },
    {
      name: "Student",
      price: "€4.99/mo",
      description: lang === "ar" ? "للأعمال الجامعية والمشاريع البحثية الصغيرة." : "For university work and small research projects.",
      items:
        lang === "ar"
          ? ["10 استبيانات", "1,000 رد", "30 تحليل AI", "تقارير PDF قريبًا"]
          : ["10 surveys", "1,000 responses", "30 AI analyses", "PDF reports planned"],
      popular: true,
    },
    {
      name: "Researcher",
      price: "€12.99/mo",
      description: lang === "ar" ? "لتحليل أعمق وتقارير أكاديمية." : "For deeper analysis and academic reporting.",
      items:
        lang === "ar"
          ? ["50 استبيان", "5,000 رد", "150 تحليل AI", "SPSS وNVivo قريبًا"]
          : ["50 surveys", "5,000 responses", "150 AI analyses", "SPSS & NVivo planned"],
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#050712] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute end-[-12rem] top-[14rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[130px]" />
        <div className="absolute bottom-[-14rem] start-[-10rem] h-[36rem] w-[36rem] rounded-full bg-emerald-400/10 blur-[140px]" />
      </div>

      <section className="relative mx-auto min-h-screen max-w-7xl px-6 py-6">
        <nav className="sticky top-6 z-50 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712] shadow-2xl shadow-blue-500/20">
              S
            </div>
            <div>
              <p className="text-base font-black tracking-tight">SurveyMind AI</p>
              <p className="text-xs text-slate-400">AI survey intelligence</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              {t.navFeatures}
            </a>
            <a href="#audience" className="hover:text-white">
              {t.navUseCases}
            </a>
            <a href="#pricing" className="hover:text-white">
              {t.navPricing}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle
              lang={lang}
              className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-white/25 sm:block"
            />
            <Link
              href="/login"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#050712] hover:bg-blue-100"
            >
              {t.startFree}
            </Link>
          </div>
        </nav>

        <div className="grid min-h-[calc(100vh-96px)] items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {t.heroBadge}
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.05em] md:text-7xl lg:text-8xl">
              {t.heroTitle1}
              <span className="block bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
                {t.heroTitle2}
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {t.heroSubtitle}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-8 py-4 text-center text-base font-black shadow-2xl shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                {t.heroCtaPrimary}
              </Link>
              <Link
                href="/s/quality-feedback-review"
                className="rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-center text-base font-bold text-slate-100 backdrop-blur transition hover:border-white/25"
              >
                {t.heroCtaSecondary}
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-3xl font-black">3</p>
                <p className="mt-1 text-sm text-slate-400">{t.statLanguages}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-3xl font-black">AI</p>
                <p className="mt-1 text-sm text-slate-400">{t.statAi}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-3xl font-black">PDF</p>
                <p className="mt-1 text-sm text-slate-400">{t.statReports}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-emerald-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[2rem] bg-[#f8fafc] p-5 text-slate-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-500">{t.workspace}</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">
                      {lang === "ar" ? "مراجعة تغذية راجعة الجودة" : "Quality Feedback Review"}
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
                    {t.liveTag}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    [t.responses, "248"],
                    [t.completion, "86%"],
                    [t.aiInsights, "12"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <p className="text-sm font-semibold text-slate-500">{label}</p>
                      <p className="mt-2 text-3xl font-black">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="font-black">{t.feedbackSignals}</p>
                    <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
                      {t.aiSummary}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {[
                      [lang === "ar" ? "وضوح التقييم" : "Assessment clarity", "78%", "w-[78%]", "bg-blue-500"],
                      [lang === "ar" ? "جودة التغذية الراجعة" : "Feedback quality", "64%", "w-[64%]", "bg-violet-500"],
                      [lang === "ar" ? "دعم التعلم" : "Learning support", "52%", "w-[52%]", "bg-emerald-500"],
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
                  <p className="text-sm font-black text-blue-700">{t.aiInterpretation}</p>
                  <p className="mt-2 leading-7 text-slate-700">{t.aiInterpretationText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="features" className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
              {t.platformLabel}
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
              {t.featuresTitle}
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-violet-400 text-[#050712] shadow-lg shadow-blue-500/20 transition group-hover:scale-110">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {feature.icon}
                  </svg>
                </div>
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
                {t.useCasesLabel}
              </p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
                {t.useCasesTitle}
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {t.audiences.map((item, i) => (
                <div
                  key={item}
                  className="rounded-[2rem] bg-[#080d1d] p-7 ring-1 ring-white/10 transition hover:ring-white/20"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      {audienceIcons[i]}
                    </svg>
                  </div>
                  <p className="text-2xl font-black">{item}</p>
                  <p className="mt-3 leading-7 text-slate-400">{t.useCasesText}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-200">
              {t.pricingLabel}
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
              {t.pricingTitle}
            </h2>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[2rem] border p-8 backdrop-blur transition hover:-translate-y-1 ${
                  plan.popular
                    ? "border-blue-400/40 bg-gradient-to-b from-blue-500/10 to-violet-500/5 shadow-2xl shadow-blue-500/10"
                    : "border-white/10 bg-white/[0.05]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 start-8 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-1 text-xs font-black uppercase tracking-wide shadow-lg shadow-blue-500/30">
                    {t.mostPopular}
                  </span>
                )}
                <p className="text-2xl font-black">{plan.name}</p>
                <p className="mt-3 text-slate-400">{plan.description}</p>
                <p className="mt-7 text-5xl font-black tracking-tight">
                  <span dir="ltr" className="inline-block">
                    {plan.price}
                  </span>
                </p>
                <ul className="mt-7 space-y-3 text-slate-300">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-emerald-400">✓</span>
                      <span>{item}</span>
                    </li>
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
