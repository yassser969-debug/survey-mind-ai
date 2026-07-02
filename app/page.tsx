"use client";

import Link from "next/link";
import { useState } from "react";

type Locale = "en" | "ar" | "es";

const languages: Array<{
  code: Locale;
  short: string;
  label: string;
}> = [
  { code: "en", short: "EN", label: "English" },
  { code: "ar", short: "AR", label: "العربية" },
  { code: "es", short: "ES", label: "Español" },
];

const content = {
  en: {
    direction: "ltr" as const,
    brandLine: "AI survey intelligence",

    nav: {
      features: "Features",
      audience: "Use cases",
      pricing: "Pricing",
      start: "Start free",
    },

    hero: {
      badge: "Built for feedback, research, and quality improvement",
      title: "Forms are only the start.",
      titleHighlight: "Insights are the goal.",
      description:
        "SurveyMind AI helps you create surveys, collect responses, understand feedback, and turn results into clear reports — without getting lost in spreadsheets.",
      primaryButton: "Start building free",
      secondaryButton: "See product preview",
    },

    highlights: [
      { value: "3", label: "Languages supported" },
      { value: "AI", label: "Insight engine" },
      { value: "PDF", label: "Report exports" },
    ],

    preview: {
      workspace: "Workspace",
      title: "Quality Feedback Review",
      live: "Live",
      responses: "Responses",
      completion: "Completion",
      insights: "AI insights",
      signals: "Feedback signals",
      summary: "AI summary",
      clarity: "Assessment clarity",
      quality: "Feedback quality",
      support: "Learning support",
      interpretation: "AI interpretation",
      interpretationText:
        "Responses indicate a need for clearer assessment criteria, faster feedback, and more practical recommendations.",
    },

    featuresSection: {
      eyebrow: "Platform",
      title: "One place to create, collect, analyse, and report.",
    },

    features: [
      {
        title: "Build smarter surveys",
        text: "Create guided surveys for students, lecturers, researchers, staff, and quality teams.",
      },
      {
        title: "Collect responses easily",
        text: "Share one link, receive responses, and keep every project organised in one workspace.",
      },
      {
        title: "Analyse with AI",
        text: "Turn raw responses into themes, summaries, patterns, and useful recommendations.",
      },
      {
        title: "Export what matters",
        text: "Prepare clear reports for Excel, PDF, presentations, and research workflows.",
      },
    ],

    audienceSection: {
      eyebrow: "Use cases",
      title: "Made for people who need answers, not just forms.",
      cardText:
        "Collect feedback, understand responses, and prepare clearer reports.",
    },

    audiences: [
      "Students",
      "Lecturers",
      "Researchers",
      "Quality teams",
    ],

    pricingSection: {
      eyebrow: "Pricing",
      title: "Start free. Upgrade when your work grows.",
    },

    plans: [
      {
        name: "Free",
        price: "€0",
        description: "Explore the platform and create your first surveys.",
        items: [
          "3 surveys",
          "100 responses",
          "5 AI analyses",
          "Basic export",
        ],
      },
      {
        name: "Student",
        price: "€4.99/mo",
        description: "For coursework, dissertations, and university projects.",
        items: [
          "10 surveys",
          "1,000 responses",
          "30 AI analyses",
          "PDF reports",
        ],
      },
      {
        name: "Researcher",
        price: "€12.99/mo",
        description: "For research projects and deeper feedback analysis.",
        items: [
          "50 surveys",
          "5,000 responses",
          "150 AI analyses",
          "Advanced reports",
        ],
      },
    ],
  },

  ar: {
    direction: "rtl" as const,
    brandLine: "ذكاء الاستبيانات والتحليل",

    nav: {
      features: "المميزات",
      audience: "مجالات الاستخدام",
      pricing: "الأسعار",
      start: "ابدأ مجانًا",
    },

    hero: {
      badge: "منصة مصممة للبحث والتغذية الراجعة وتطوير الجودة",
      title: "إنشاء الاستبيان هو البداية.",
      titleHighlight: "أما الفهم فهو الهدف.",
      description:
        "تساعدك SurveyMind AI على إنشاء الاستبيانات، وجمع الردود، وفهم آراء المشاركين، وتحويل النتائج إلى تقارير واضحة دون الضياع بين الجداول والملفات.",
      primaryButton: "أنشئ استبيانك مجانًا",
      secondaryButton: "شاهد فكرة المنصة",
    },

    highlights: [
      { value: "3", label: "لغات مدعومة" },
      { value: "AI", label: "محرك تحليل ذكي" },
      { value: "PDF", label: "تقارير قابلة للتصدير" },
    ],

    preview: {
      workspace: "مساحة العمل",
      title: "مراجعة جودة تجربة الطلاب",
      live: "مباشر",
      responses: "عدد الردود",
      completion: "نسبة الإكمال",
      insights: "نتائج ذكية",
      signals: "مؤشرات التغذية الراجعة",
      summary: "ملخص ذكي",
      clarity: "وضوح التقييم",
      quality: "جودة الملاحظات",
      support: "الدعم التعليمي",
      interpretation: "قراءة النتائج",
      interpretationText:
        "تشير الردود إلى الحاجة لمعايير تقييم أوضح، وملاحظات أسرع، وتوصيات عملية تساعد على التحسين.",
    },

    featuresSection: {
      eyebrow: "المنصة",
      title: "كل ما تحتاجه لإنشاء الاستبيان وجمع الردود وتحليلها.",
    },

    features: [
      {
        title: "أنشئ استبيانات أفضل",
        text: "صمّم استبيانات واضحة للطلاب والمحاضرين والباحثين وفرق الجودة.",
      },
      {
        title: "اجمع الردود بسهولة",
        text: "شارك رابطًا واحدًا، واستقبل الردود، ونظّم مشاريعك داخل مساحة عمل واحدة.",
      },
      {
        title: "افهم النتائج بالذكاء الاصطناعي",
        text: "اكتشف المواضيع المتكررة والأنماط والملخصات والتوصيات المفيدة.",
      },
      {
        title: "جهّز تقارير واضحة",
        text: "حوّل النتائج إلى تقارير مناسبة لملفات Excel وPDF والعروض والأبحاث.",
      },
    ],

    audienceSection: {
      eyebrow: "مجالات الاستخدام",
      title: "للأشخاص الذين يبحثون عن إجابات، وليس مجرد نماذج.",
      cardText:
        "اجمع الآراء، وافهم الردود، وحوّل النتائج إلى تقارير أكثر وضوحًا.",
    },

    audiences: [
      "الطلاب",
      "المحاضرون",
      "الباحثون",
      "فرق الجودة",
    ],

    pricingSection: {
      eyebrow: "الأسعار",
      title: "ابدأ مجانًا، وطوّر خطتك عندما تتوسع أعمالك.",
    },

    plans: [
      {
        name: "المجانية",
        price: "€0",
        description: "جرّب المنصة وأنشئ استبياناتك الأولى.",
        items: [
          "3 استبيانات",
          "100 رد",
          "5 تحليلات ذكية",
          "تصدير أساسي",
        ],
      },
      {
        name: "الطلاب",
        price: "€4.99 شهريًا",
        description: "للمقررات والرسائل الجامعية والمشاريع الأكاديمية.",
        items: [
          "10 استبيانات",
          "1,000 رد",
          "30 تحليلًا ذكيًا",
          "تقارير PDF",
        ],
      },
      {
        name: "الباحثون",
        price: "€12.99 شهريًا",
        description: "للمشاريع البحثية والتحليل المتقدم للردود.",
        items: [
          "50 استبيانًا",
          "5,000 رد",
          "150 تحليلًا ذكيًا",
          "تقارير متقدمة",
        ],
      },
    ],
  },

  es: {
    direction: "ltr" as const,
    brandLine: "Inteligencia para encuestas",

    nav: {
      features: "Funciones",
      audience: "Casos de uso",
      pricing: "Precios",
      start: "Empieza gratis",
    },

    hero: {
      badge: "Creado para investigación, feedback y mejora de la calidad",
      title: "Crear el formulario es solo el comienzo.",
      titleHighlight: "Comprender las respuestas es la meta.",
      description:
        "SurveyMind AI te ayuda a crear encuestas, recopilar respuestas, comprender el feedback y convertir los resultados en informes claros sin perderte entre hojas de cálculo.",
      primaryButton: "Crea tu encuesta gratis",
      secondaryButton: "Descubre la plataforma",
    },

    highlights: [
      { value: "3", label: "Idiomas disponibles" },
      { value: "AI", label: "Motor de análisis" },
      { value: "PDF", label: "Informes exportables" },
    ],

    preview: {
      workspace: "Espacio de trabajo",
      title: "Revisión de calidad académica",
      live: "En directo",
      responses: "Respuestas",
      completion: "Completado",
      insights: "Hallazgos de IA",
      signals: "Señales del feedback",
      summary: "Resumen con IA",
      clarity: "Claridad de la evaluación",
      quality: "Calidad del feedback",
      support: "Apoyo al aprendizaje",
      interpretation: "Interpretación de IA",
      interpretationText:
        "Las respuestas muestran que los participantes necesitan criterios más claros, feedback más rápido y recomendaciones prácticas.",
    },

    featuresSection: {
      eyebrow: "Plataforma",
      title: "Crea, recopila, analiza y presenta resultados en un solo lugar.",
    },

    features: [
      {
        title: "Crea mejores encuestas",
        text: "Diseña encuestas claras para estudiantes, docentes, investigadores y equipos de calidad.",
      },
      {
        title: "Recopila respuestas fácilmente",
        text: "Comparte un solo enlace y organiza todos tus proyectos en un mismo espacio.",
      },
      {
        title: "Analiza con inteligencia artificial",
        text: "Convierte respuestas en temas, patrones, resúmenes y recomendaciones útiles.",
      },
      {
        title: "Presenta resultados claros",
        text: "Prepara informes para Excel, PDF, presentaciones y proyectos de investigación.",
      },
    ],

    audienceSection: {
      eyebrow: "Casos de uso",
      title: "Para quienes necesitan respuestas, no solo formularios.",
      cardText:
        "Recopila opiniones, comprende las respuestas y prepara informes más claros.",
    },

    audiences: [
      "Estudiantes",
      "Docentes",
      "Investigadores",
      "Equipos de calidad",
    ],

    pricingSection: {
      eyebrow: "Precios",
      title: "Empieza gratis y amplía tu plan cuando lo necesites.",
    },

    plans: [
      {
        name: "Gratis",
        price: "€0",
        description: "Explora la plataforma y crea tus primeras encuestas.",
        items: [
          "3 encuestas",
          "100 respuestas",
          "5 análisis con IA",
          "Exportación básica",
        ],
      },
      {
        name: "Estudiante",
        price: "€4.99/mes",
        description: "Para trabajos universitarios y proyectos académicos.",
        items: [
          "10 encuestas",
          "1.000 respuestas",
          "30 análisis con IA",
          "Informes PDF",
        ],
      },
      {
        name: "Investigador",
        price: "€12.99/mes",
        description: "Para proyectos de investigación y análisis avanzado.",
        items: [
          "50 encuestas",
          "5.000 respuestas",
          "150 análisis con IA",
          "Informes avanzados",
        ],
      },
    ],
  },
};

export default function Home() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  const page = content[locale];
  const currentLanguage = languages.find(
    (language) => language.code === locale
  );

  const alignment =
    page.direction === "rtl" ? "text-right" : "text-left";

  return (
    <main
      dir={page.direction}
      className="min-h-screen bg-[#050712] text-white"
    >
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

            <div className={alignment}>
              <p className="text-base font-black tracking-tight">
                SurveyMind AI
              </p>
              <p className="text-xs text-slate-400">
                {page.brandLine}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              {page.nav.features}
            </a>

            <a href="#audience" className="hover:text-white">
              {page.nav.audience}
            </a>

            <a href="#pricing" className="hover:text-white">
              {page.nav.pricing}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageOpen((open) => !open)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-white/25"
              >
                🌐 {currentLanguage?.short}
              </button>

              {languageOpen && (
                <div
                  className={`absolute mt-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] p-2 shadow-2xl shadow-black/40 ${
                    page.direction === "rtl" ? "left-0" : "right-0"
                  }`}
                >
                  {languages.map((language) => (
                    <button
                      type="button"
                      key={language.code}
                      onClick={() => {
                        setLocale(language.code);
                        setLanguageOpen(false);
                      }}
                      className={`block w-full rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 ${
                        language.code === "ar"
                          ? "text-right"
                          : "text-left"
                      }`}
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
              {page.nav.start}
            </Link>
          </div>
        </nav>

        <div className="grid min-h-[calc(100vh-96px)] items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={alignment}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {page.hero.badge}
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.05em] md:text-7xl lg:text-8xl">
              {page.hero.title}

              <span className="block bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
                {page.hero.titleHighlight}
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {page.hero.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-8 py-4 text-center text-base font-black shadow-2xl shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                {page.hero.primaryButton}
              </Link>

              <a
                href="#features"
                className="rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-center text-base font-bold text-slate-100 backdrop-blur transition hover:border-white/25"
              >
                {page.hero.secondaryButton}
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              {page.highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur"
                >
                  <p className="text-3xl font-black">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-emerald-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[2rem] bg-[#f8fafc] p-5 text-slate-950">
                <div className="flex items-center justify-between">
                  <div className={alignment}>
                    <p className="text-sm font-bold text-slate-500">
                      {page.preview.workspace}
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-tight">
                      {page.preview.title}
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
                    {page.preview.live}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    [page.preview.responses, "248"],
                    [page.preview.completion, "86%"],
                    [page.preview.insights, "12"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className={`rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 ${alignment}`}
                    >
                      <p className="text-sm font-semibold text-slate-500">
                        {label}
                      </p>
                      <p className="mt-2 text-3xl font-black">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="font-black">
                      {page.preview.signals}
                    </p>

                    <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
                      {page.preview.summary}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {[
                      [
                        page.preview.clarity,
                        "78%",
                        "w-[78%]",
                        "bg-blue-500",
                      ],
                      [
                        page.preview.quality,
                        "64%",
                        "w-[64%]",
                        "bg-violet-500",
                      ],
                      [
                        page.preview.support,
                        "52%",
                        "w-[52%]",
                        "bg-emerald-500",
                      ],
                    ].map(([label, value, width, color]) => (
                      <div key={label}>
                        <div className="mb-2 flex justify-between text-sm font-bold">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>

                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className={`h-3 rounded-full ${width} ${color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`mt-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-5 ${alignment}`}
                >
                  <p className="text-sm font-black text-blue-700">
                    {page.preview.interpretation}
                  </p>

                  <p className="mt-2 leading-7 text-slate-700">
                    {page.preview.interpretationText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="features" className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
              {page.featuresSection.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
              {page.featuresSection.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {page.features.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.08] ${alignment}`}
              >
                <div className="mb-5 h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-400" />

                <h3 className="text-xl font-black">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="audience" className="py-24">
          <div className="rounded-[3rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur md:p-12">
            <div className={`max-w-3xl ${alignment}`}>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
                {page.audienceSection.eyebrow}
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
                {page.audienceSection.title}
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {page.audiences.map((item) => (
                <div
                  key={item}
                  className={`rounded-[2rem] bg-[#080d1d] p-7 ring-1 ring-white/10 ${alignment}`}
                >
                  <p className="text-2xl font-black">{item}</p>

                  <p className="mt-3 leading-7 text-slate-400">
                    {page.audienceSection.cardText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-200">
              {page.pricingSection.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] md:text-6xl">
              {page.pricingSection.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {page.plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur ${alignment}`}
              >
                <p className="text-2xl font-black">{plan.name}</p>

                <p className="mt-3 text-slate-400">
                  {plan.description}
                </p>

                <p className="mt-7 text-5xl font-black tracking-tight">
                  {plan.price}
                </p>

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