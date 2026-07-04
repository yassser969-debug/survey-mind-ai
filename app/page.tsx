"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

type Locale = "en" | "ar" | "es";

function readCookieLocale(): Locale | null {
  const match = document.cookie.match(/(?:^|; )sm_locale=(\w+)/);
  return match && (match[1] === "en" || match[1] === "ar" || match[1] === "es")
    ? (match[1] as Locale)
    : null;
}

function persistLocale(code: Locale) {
  document.cookie = `sm_locale=${code};path=/;max-age=31536000;samesite=lax`;
}

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
      howItWorks: "How it works",
      templates: "Templates",
      pricing: "Pricing",
      faq: "FAQ",
      login: "Log in",
      start: "Start free",
    },

    hero: {
      badge: "Built for research, feedback, and quality improvement",
      title: "Create better surveys.",
      titleHighlight: "Understand every response.",
      description:
        "SurveyMind AI helps students, lecturers, researchers, and quality teams create surveys, collect responses, and turn feedback into clear, useful insight.",
      primaryButton: "Start building free",
      secondaryButton: "See how it works",
      note: "No credit card required",
    },

    highlights: [
      { value: "3", label: "Languages" },
      { value: "AI", label: "Insight engine" },
      { value: "PDF", label: "Clear reports" },
    ],

    preview: {
      workspace: "Workspace",
      title: "Student Experience Review",
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
        "Responses suggest that students want clearer assessment criteria, faster feedback, and more practical examples.",
    },

    trust: {
      label: "Designed for",
      items: [
        "Students",
        "Lecturers",
        "Researchers",
        "Quality teams",
        "Universities",
      ],
    },

    howItWorks: {
      eyebrow: "How it works",
      title: "From an idea to useful insight in three simple steps.",
      steps: [
        {
          number: "01",
          title: "Create",
          text: "Build a survey from scratch or begin with a ready-made template.",
        },
        {
          number: "02",
          title: "Collect",
          text: "Share one link and receive responses in an organised workspace.",
        },
        {
          number: "03",
          title: "Understand",
          text: "Use AI-supported summaries to identify themes, patterns, and next steps.",
        },
      ],
    },

    featuresSection: {
      eyebrow: "Platform",
      title: "Everything you need to move from questions to decisions.",
      description:
        "A focused workspace for creating surveys, organising responses, and preparing clear reports.",
    },

    features: [
      {
        icon: "✦",
        title: "Smart survey builder",
        text: "Create clear surveys for academic research, teaching, feedback, and quality reviews.",
      },
      {
        icon: "↗",
        title: "Simple sharing",
        text: "Share a public link and let participants respond without creating an account.",
      },
      {
        icon: "◎",
        title: "AI-supported analysis",
        text: "Turn open-text and structured responses into themes, summaries, and recommendations.",
      },
      {
        icon: "▦",
        title: "Clear dashboards",
        text: "Review completion rates, response trends, and important feedback signals.",
      },
      {
        icon: "↓",
        title: "Useful exports",
        text: "Prepare results for PDF, Excel, presentations, and future research workflows.",
      },
      {
        icon: "⌁",
        title: "Multilingual experience",
        text: "Use the platform naturally in English, Arabic, and Spanish.",
      },
    ],

    templatesSection: {
      eyebrow: "Templates",
      title: "Start faster with templates made for real academic work.",
      description:
        "Choose a starting point, customise the questions, and publish when you are ready.",
      button: "Explore templates",
      templates: [
        {
          label: "Student experience",
          category: "Education",
          questions: "12 questions",
        },
        {
          label: "Course evaluation",
          category: "Teaching",
          questions: "15 questions",
        },
        {
          label: "Research questionnaire",
          category: "Research",
          questions: "20 questions",
        },
        {
          label: "Quality improvement",
          category: "Quality",
          questions: "10 questions",
        },
      ],
    },

    aiSection: {
      eyebrow: "AI analysis",
      title: "See more than totals and percentages.",
      description:
        "SurveyMind AI is designed to help you understand what participants are saying, where patterns appear, and what may require attention.",
      points: [
        "Summarise open-text responses",
        "Identify repeated themes",
        "Highlight changes and gaps",
        "Prepare practical recommendations",
      ],
      cardTitle: "Key finding",
      cardText:
        "Participants value the course content, but many want clearer assessment guidance before major assignments.",
      themeTitle: "Common themes",
      themes: ["Assessment clarity", "Feedback speed", "Practical examples"],
    },

    audienceSection: {
      eyebrow: "Use cases",
      title: "A focused platform for people who need reliable answers.",
      cardText:
        "Create surveys, organise feedback, and prepare clearer evidence for your work.",
    },

    audiences: [
      {
        title: "Students",
        text: "Create questionnaires for projects, assignments, and dissertations.",
      },
      {
        title: "Lecturers",
        text: "Collect course feedback and understand the student experience.",
      },
      {
        title: "Researchers",
        text: "Organise responses and prepare results for deeper analysis.",
      },
      {
        title: "Quality teams",
        text: "Track service quality, identify gaps, and support improvement.",
      },
    ],

    pricingSection: {
      eyebrow: "Pricing",
      title: "Start free. Upgrade when your work grows.",
      description:
        "Clear plans for individuals, students, and research projects.",
      popular: "Most popular",
      button: "Choose plan",
    },

    plans: [
      {
        name: "Free",
        price: "€0",
        period: "",
        description: "Explore the platform and create your first surveys.",
        items: [
          "3 surveys",
          "100 responses",
          "5 AI analyses",
          "Basic export",
        ],
        featured: false,
      },
      {
        name: "Student",
        price: "€4.99",
        period: "/month",
        description: "For coursework, dissertations, and university projects.",
        items: [
          "10 surveys",
          "1,000 responses",
          "30 AI analyses",
          "PDF reports",
        ],
        featured: true,
      },
      {
        name: "Researcher",
        price: "€12.99",
        period: "/month",
        description: "For research projects and deeper feedback analysis.",
        items: [
          "50 surveys",
          "5,000 responses",
          "150 AI analyses",
          "Advanced reports",
        ],
        featured: false,
      },
    ],

    faqSection: {
      eyebrow: "FAQ",
      title: "Questions before you begin?",
      items: [
        {
          question: "Can participants answer without creating an account?",
          answer:
            "Yes. Survey creators will have accounts, while participants will be able to answer through a public survey link.",
        },
        {
          question: "Does the platform support Arabic?",
          answer:
            "Yes. The interface is designed to support Arabic naturally with full right-to-left layout.",
        },
        {
          question: "Will AI replace my own analysis?",
          answer:
            "No. AI is intended to support your understanding by summarising and identifying patterns. You remain responsible for interpretation and final decisions.",
        },
        {
          question: "Can I export my results?",
          answer:
            "The product roadmap includes PDF, Excel, and presentation-ready reports, followed later by deeper research-tool integrations.",
        },
      ],
    },

    finalCta: {
      eyebrow: "Start today",
      title: "Turn your next survey into clearer understanding.",
      description:
        "Create your workspace and begin building your first survey.",
      primary: "Create free account",
      secondary: "Log in",
    },

    footer: {
      description:
        "A calm, multilingual platform for surveys, research, feedback, and quality improvement.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      links: {
        features: "Features",
        templates: "Templates",
        pricing: "Pricing",
        about: "About",
        contact: "Contact",
        privacy: "Privacy",
        terms: "Terms",
      },
      copyright: "SurveyMind AI. All rights reserved.",
    },
  },

  ar: {
    direction: "rtl" as const,
    brandLine: "ذكاء الاستبيانات والتحليل",

    nav: {
      features: "المميزات",
      howItWorks: "كيف تعمل",
      templates: "القوالب",
      pricing: "الأسعار",
      faq: "الأسئلة",
      login: "تسجيل الدخول",
      start: "ابدأ مجانًا",
    },

    hero: {
      badge: "منصة مصممة للبحث والتغذية الراجعة وتطوير الجودة",
      title: "أنشئ استبيانات أفضل.",
      titleHighlight: "وافهم كل إجابة.",
      description:
        "تساعد SurveyMind AI الطلاب والمحاضرين والباحثين وفرق الجودة على إنشاء الاستبيانات، وجمع الردود، وتحويل الآراء إلى نتائج واضحة ومفيدة.",
      primaryButton: "ابدأ إنشاء استبيانك",
      secondaryButton: "اكتشف طريقة العمل",
      note: "لا تحتاج إلى بطاقة دفع",
    },

    highlights: [
      { value: "3", label: "لغات" },
      { value: "AI", label: "محرك تحليل ذكي" },
      { value: "PDF", label: "تقارير واضحة" },
    ],

    preview: {
      workspace: "مساحة العمل",
      title: "مراجعة تجربة الطلاب",
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
        "تشير الردود إلى أن الطلاب يرغبون في معايير تقييم أوضح، وملاحظات أسرع، وأمثلة عملية أكثر.",
    },

    trust: {
      label: "مصممة من أجل",
      items: [
        "الطلاب",
        "المحاضرين",
        "الباحثين",
        "فرق الجودة",
        "الجامعات",
      ],
    },

    howItWorks: {
      eyebrow: "كيف تعمل",
      title: "من الفكرة إلى نتائج مفيدة في ثلاث خطوات بسيطة.",
      steps: [
        {
          number: "01",
          title: "أنشئ",
          text: "ابدأ استبيانك من الصفر أو اختر قالبًا جاهزًا يناسب احتياجك.",
        },
        {
          number: "02",
          title: "اجمع",
          text: "شارك رابطًا واحدًا، واستقبل الردود داخل مساحة عمل منظمة.",
        },
        {
          number: "03",
          title: "افهم",
          text: "استفد من الملخصات الذكية لاكتشاف الأنماط والمواضيع والخطوات القادمة.",
        },
      ],
    },

    featuresSection: {
      eyebrow: "المنصة",
      title: "كل ما تحتاجه للانتقال من الأسئلة إلى القرارات.",
      description:
        "مساحة عمل مركزة لإنشاء الاستبيانات وتنظيم الردود وإعداد تقارير واضحة.",
    },

    features: [
      {
        icon: "✦",
        title: "منشئ استبيانات ذكي",
        text: "أنشئ استبيانات واضحة للأبحاث والتعليم والتغذية الراجعة ومراجعات الجودة.",
      },
      {
        icon: "↗",
        title: "مشاركة سهلة",
        text: "شارك رابطًا عامًا، ودع المشاركين يجيبون دون الحاجة إلى إنشاء حساب.",
      },
      {
        icon: "◎",
        title: "تحليل مدعوم بالذكاء الاصطناعي",
        text: "حوّل الإجابات النصية والمنظمة إلى مواضيع وملخصات وتوصيات.",
      },
      {
        icon: "▦",
        title: "لوحات نتائج واضحة",
        text: "راجع نسب الإكمال واتجاهات الردود وأهم مؤشرات التغذية الراجعة.",
      },
      {
        icon: "↓",
        title: "تصدير مفيد",
        text: "جهّز النتائج لملفات PDF وExcel والعروض ومسارات البحث المستقبلية.",
      },
      {
        icon: "⌁",
        title: "تجربة متعددة اللغات",
        text: "استخدم المنصة بشكل طبيعي باللغة العربية والإنجليزية والإسبانية.",
      },
    ],

    templatesSection: {
      eyebrow: "القوالب",
      title: "ابدأ بسرعة بقوالب مصممة للعمل الأكاديمي الحقيقي.",
      description:
        "اختر نقطة بداية، وعدّل الأسئلة، وانشر الاستبيان عندما يصبح جاهزًا.",
      button: "استعرض القوالب",
      templates: [
        {
          label: "تجربة الطلاب",
          category: "التعليم",
          questions: "12 سؤالًا",
        },
        {
          label: "تقييم المقرر",
          category: "التدريس",
          questions: "15 سؤالًا",
        },
        {
          label: "استبيان بحثي",
          category: "البحث",
          questions: "20 سؤالًا",
        },
        {
          label: "تطوير الجودة",
          category: "الجودة",
          questions: "10 أسئلة",
        },
      ],
    },

    aiSection: {
      eyebrow: "التحليل الذكي",
      title: "شاهد ما وراء الأرقام والنسب.",
      description:
        "صُممت SurveyMind AI لمساعدتك على فهم ما يقوله المشاركون، وأين تظهر الأنماط، وما الذي قد يحتاج إلى اهتمام.",
      points: [
        "تلخيص الإجابات النصية",
        "اكتشاف المواضيع المتكررة",
        "إبراز التغيرات والفجوات",
        "إعداد توصيات عملية",
      ],
      cardTitle: "أهم نتيجة",
      cardText:
        "يقدّر المشاركون محتوى المقرر، لكن عددًا منهم يرغب في إرشادات أوضح قبل الواجبات الأساسية.",
      themeTitle: "المواضيع المتكررة",
      themes: ["وضوح التقييم", "سرعة الملاحظات", "الأمثلة العملية"],
    },

    audienceSection: {
      eyebrow: "مجالات الاستخدام",
      title: "منصة مركزة للأشخاص الذين يحتاجون إلى إجابات موثوقة.",
      cardText:
        "أنشئ الاستبيانات، ونظّم التغذية الراجعة، وقدّم أدلة أوضح لعملك.",
    },

    audiences: [
      {
        title: "الطلاب",
        text: "أنشئ استبيانات للمشاريع والتكاليف والرسائل الجامعية.",
      },
      {
        title: "المحاضرون",
        text: "اجمع تقييم المقررات وافهم تجربة الطلاب بصورة أفضل.",
      },
      {
        title: "الباحثون",
        text: "نظّم الردود وجهّز النتائج للتحليل المتقدم.",
      },
      {
        title: "فرق الجودة",
        text: "تابع جودة الخدمات، واكتشف الفجوات، وادعم التحسين.",
      },
    ],

    pricingSection: {
      eyebrow: "الأسعار",
      title: "ابدأ مجانًا، وطوّر خطتك عندما يتوسع عملك.",
      description:
        "خطط واضحة للأفراد والطلاب والمشاريع البحثية.",
      popular: "الأكثر اختيارًا",
      button: "اختر الخطة",
    },

    plans: [
      {
        name: "المجانية",
        price: "€0",
        period: "",
        description: "استكشف المنصة وأنشئ استبياناتك الأولى.",
        items: [
          "3 استبيانات",
          "100 رد",
          "5 تحليلات ذكية",
          "تصدير أساسي",
        ],
        featured: false,
      },
      {
        name: "الطلاب",
        price: "€4.99",
        period: "/شهريًا",
        description: "للمقررات والرسائل الجامعية والمشاريع الأكاديمية.",
        items: [
          "10 استبيانات",
          "1,000 رد",
          "30 تحليلًا ذكيًا",
          "تقارير PDF",
        ],
        featured: true,
      },
      {
        name: "الباحثون",
        price: "€12.99",
        period: "/شهريًا",
        description: "للمشاريع البحثية والتحليل المتقدم للردود.",
        items: [
          "50 استبيانًا",
          "5,000 رد",
          "150 تحليلًا ذكيًا",
          "تقارير متقدمة",
        ],
        featured: false,
      },
    ],

    faqSection: {
      eyebrow: "الأسئلة الشائعة",
      title: "هل لديك أسئلة قبل أن تبدأ؟",
      items: [
        {
          question: "هل يستطيع المشاركون الإجابة دون إنشاء حساب؟",
          answer:
            "نعم. يحتاج منشئ الاستبيان إلى حساب، بينما يستطيع المشاركون الإجابة من خلال رابط عام.",
        },
        {
          question: "هل تدعم المنصة اللغة العربية؟",
          answer:
            "نعم. صُممت الواجهة لدعم العربية بشكل طبيعي مع اتجاه كامل من اليمين إلى اليسار.",
        },
        {
          question: "هل يستبدل الذكاء الاصطناعي تحليلي الشخصي؟",
          answer:
            "لا. يساعدك الذكاء الاصطناعي على التلخيص واكتشاف الأنماط، بينما تبقى مسؤولًا عن التفسير والقرارات النهائية.",
        },
        {
          question: "هل أستطيع تصدير النتائج؟",
          answer:
            "تشمل خطة المنتج تقارير PDF وExcel وتقارير مناسبة للعروض، ثم تكاملات أعمق مع أدوات البحث لاحقًا.",
        },
      ],
    },

    finalCta: {
      eyebrow: "ابدأ اليوم",
      title: "حوّل استبيانك القادم إلى فهم أوضح.",
      description:
        "أنشئ مساحة عملك وابدأ في إعداد استبيانك الأول.",
      primary: "أنشئ حسابًا مجانيًا",
      secondary: "تسجيل الدخول",
    },

    footer: {
      description:
        "منصة هادئة ومتعددة اللغات للاستبيانات والبحث والتغذية الراجعة وتطوير الجودة.",
      product: "المنتج",
      company: "الشركة",
      legal: "القانوني",
      links: {
        features: "المميزات",
        templates: "القوالب",
        pricing: "الأسعار",
        about: "من نحن",
        contact: "تواصل معنا",
        privacy: "الخصوصية",
        terms: "الشروط",
      },
      copyright: "SurveyMind AI. جميع الحقوق محفوظة.",
    },
  },

  es: {
    direction: "ltr" as const,
    brandLine: "Inteligencia para encuestas",

    nav: {
      features: "Funciones",
      howItWorks: "Cómo funciona",
      templates: "Plantillas",
      pricing: "Precios",
      faq: "Preguntas",
      login: "Iniciar sesión",
      start: "Empieza gratis",
    },

    hero: {
      badge: "Creado para investigación, feedback y mejora de la calidad",
      title: "Crea mejores encuestas.",
      titleHighlight: "Comprende cada respuesta.",
      description:
        "SurveyMind AI ayuda a estudiantes, docentes, investigadores y equipos de calidad a crear encuestas, recopilar respuestas y convertir opiniones en información clara y útil.",
      primaryButton: "Empieza a crear gratis",
      secondaryButton: "Descubre cómo funciona",
      note: "No necesitas tarjeta",
    },

    highlights: [
      { value: "3", label: "Idiomas" },
      { value: "AI", label: "Motor de análisis" },
      { value: "PDF", label: "Informes claros" },
    ],

    preview: {
      workspace: "Espacio de trabajo",
      title: "Revisión de experiencia estudiantil",
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
        "Las respuestas indican que los estudiantes quieren criterios más claros, feedback más rápido y más ejemplos prácticos.",
    },

    trust: {
      label: "Diseñado para",
      items: [
        "Estudiantes",
        "Docentes",
        "Investigadores",
        "Equipos de calidad",
        "Universidades",
      ],
    },

    howItWorks: {
      eyebrow: "Cómo funciona",
      title: "De una idea a información útil en tres pasos sencillos.",
      steps: [
        {
          number: "01",
          title: "Crea",
          text: "Diseña una encuesta desde cero o comienza con una plantilla.",
        },
        {
          number: "02",
          title: "Recopila",
          text: "Comparte un enlace y recibe respuestas en un espacio organizado.",
        },
        {
          number: "03",
          title: "Comprende",
          text: "Usa resúmenes con IA para identificar temas, patrones y próximos pasos.",
        },
      ],
    },

    featuresSection: {
      eyebrow: "Plataforma",
      title: "Todo lo necesario para pasar de preguntas a decisiones.",
      description:
        "Un espacio centrado en crear encuestas, organizar respuestas y preparar informes claros.",
    },

    features: [
      {
        icon: "✦",
        title: "Creador inteligente",
        text: "Crea encuestas claras para investigación, enseñanza, feedback y calidad.",
      },
      {
        icon: "↗",
        title: "Enlaces sencillos",
        text: "Comparte un enlace público sin obligar a los participantes a crear una cuenta.",
      },
      {
        icon: "◎",
        title: "Análisis con IA",
        text: "Convierte respuestas abiertas y estructuradas en temas, resúmenes y recomendaciones.",
      },
      {
        icon: "▦",
        title: "Paneles claros",
        text: "Revisa tasas de finalización, tendencias y señales importantes.",
      },
      {
        icon: "↓",
        title: "Exportaciones útiles",
        text: "Prepara resultados para PDF, Excel, presentaciones y futuros flujos de investigación.",
      },
      {
        icon: "⌁",
        title: "Experiencia multilingüe",
        text: "Utiliza la plataforma de forma natural en español, inglés y árabe.",
      },
    ],

    templatesSection: {
      eyebrow: "Plantillas",
      title: "Empieza más rápido con plantillas para el trabajo académico.",
      description:
        "Elige un punto de partida, adapta las preguntas y publica cuando estés listo.",
      button: "Explorar plantillas",
      templates: [
        {
          label: "Experiencia estudiantil",
          category: "Educación",
          questions: "12 preguntas",
        },
        {
          label: "Evaluación del curso",
          category: "Enseñanza",
          questions: "15 preguntas",
        },
        {
          label: "Cuestionario de investigación",
          category: "Investigación",
          questions: "20 preguntas",
        },
        {
          label: "Mejora de la calidad",
          category: "Calidad",
          questions: "10 preguntas",
        },
      ],
    },

    aiSection: {
      eyebrow: "Análisis con IA",
      title: "Descubre más que totales y porcentajes.",
      description:
        "SurveyMind AI está diseñada para ayudarte a comprender lo que dicen los participantes, dónde aparecen patrones y qué puede requerir atención.",
      points: [
        "Resumir respuestas abiertas",
        "Identificar temas repetidos",
        "Destacar cambios y carencias",
        "Preparar recomendaciones prácticas",
      ],
      cardTitle: "Hallazgo principal",
      cardText:
        "Los participantes valoran el contenido del curso, pero muchos desean instrucciones más claras antes de las tareas importantes.",
      themeTitle: "Temas comunes",
      themes: [
        "Claridad de evaluación",
        "Rapidez del feedback",
        "Ejemplos prácticos",
      ],
    },

    audienceSection: {
      eyebrow: "Casos de uso",
      title: "Una plataforma para quienes necesitan respuestas fiables.",
      cardText:
        "Crea encuestas, organiza feedback y prepara evidencias más claras.",
    },

    audiences: [
      {
        title: "Estudiantes",
        text: "Crea cuestionarios para proyectos, trabajos y tesis.",
      },
      {
        title: "Docentes",
        text: "Recopila opiniones sobre cursos y comprende la experiencia del estudiante.",
      },
      {
        title: "Investigadores",
        text: "Organiza respuestas y prepara resultados para análisis avanzados.",
      },
      {
        title: "Equipos de calidad",
        text: "Supervisa servicios, identifica carencias y apoya la mejora.",
      },
    ],

    pricingSection: {
      eyebrow: "Precios",
      title: "Empieza gratis y amplía tu plan cuando crezca tu trabajo.",
      description:
        "Planes claros para personas, estudiantes y proyectos de investigación.",
      popular: "Más popular",
      button: "Elegir plan",
    },

    plans: [
      {
        name: "Gratis",
        price: "€0",
        period: "",
        description: "Explora la plataforma y crea tus primeras encuestas.",
        items: [
          "3 encuestas",
          "100 respuestas",
          "5 análisis con IA",
          "Exportación básica",
        ],
        featured: false,
      },
      {
        name: "Estudiante",
        price: "€4.99",
        period: "/mes",
        description: "Para cursos, tesis y proyectos universitarios.",
        items: [
          "10 encuestas",
          "1.000 respuestas",
          "30 análisis con IA",
          "Informes PDF",
        ],
        featured: true,
      },
      {
        name: "Investigador",
        price: "€12.99",
        period: "/mes",
        description: "Para proyectos de investigación y análisis avanzado.",
        items: [
          "50 encuestas",
          "5.000 respuestas",
          "150 análisis con IA",
          "Informes avanzados",
        ],
        featured: false,
      },
    ],

    faqSection: {
      eyebrow: "Preguntas frecuentes",
      title: "¿Tienes preguntas antes de comenzar?",
      items: [
        {
          question: "¿Pueden responder sin crear una cuenta?",
          answer:
            "Sí. El creador tendrá una cuenta, pero los participantes podrán responder mediante un enlace público.",
        },
        {
          question: "¿La plataforma funciona en árabe?",
          answer:
            "Sí. La interfaz admite árabe de forma natural, con diseño completo de derecha a izquierda.",
        },
        {
          question: "¿La IA sustituye mi propio análisis?",
          answer:
            "No. La IA ayuda a resumir y detectar patrones, pero tú mantienes la responsabilidad sobre la interpretación y las decisiones.",
        },
        {
          question: "¿Puedo exportar mis resultados?",
          answer:
            "La hoja de ruta incluye informes PDF, Excel y presentaciones, además de futuras integraciones con herramientas de investigación.",
        },
      ],
    },

    finalCta: {
      eyebrow: "Empieza hoy",
      title: "Convierte tu próxima encuesta en una comprensión más clara.",
      description:
        "Crea tu espacio de trabajo y comienza tu primera encuesta.",
      primary: "Crear cuenta gratuita",
      secondary: "Iniciar sesión",
    },

    footer: {
      description:
        "Una plataforma tranquila y multilingüe para encuestas, investigación, feedback y calidad.",
      product: "Producto",
      company: "Empresa",
      legal: "Legal",
      links: {
        features: "Funciones",
        templates: "Plantillas",
        pricing: "Precios",
        about: "Nosotros",
        contact: "Contacto",
        privacy: "Privacidad",
        terms: "Términos",
      },
      copyright: "SurveyMind AI. Todos los derechos reservados.",
    },
  },
};

export default function Home() {
  const [languageOpen, setLanguageOpen] = useState(false);

  // The saved preference (shared with the rest of the platform via cookie).
  const cookieLocale = useSyncExternalStore(
    () => () => {},
    readCookieLocale,
    () => null
  );
  const [override, setOverride] = useState<Locale | null>(null);
  const locale = override ?? cookieLocale ?? "en";

  const chooseLocale = (code: Locale) => {
    setOverride(code);
    persistLocale(code);
  };

  const page = content[locale];
  const currentLanguage = languages.find(
    (language) => language.code === locale
  );

  const alignment =
    page.direction === "rtl" ? "text-right" : "text-left";

  return (
    <main
      dir={page.direction}
      className="min-h-screen overflow-hidden bg-[#050712] text-white"
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-22rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[150px]" />
        <div className="absolute right-[-14rem] top-[12rem] h-[36rem] w-[36rem] rounded-full bg-violet-500/20 blur-[140px]" />
        <div className="absolute bottom-[-16rem] left-[-12rem] h-[40rem] w-[40rem] rounded-full bg-emerald-400/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-5 sm:px-6">
        <nav className="sticky top-5 z-50 rounded-full border border-white/10 bg-[#090d1a]/80 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712] shadow-lg shadow-blue-500/20">
                S
              </div>

              <div className={`hidden sm:block ${alignment}`}>
                <p className="text-base font-black tracking-tight">
                  SurveyMind AI
                </p>
                <p className="text-xs text-slate-400">
                  {page.brandLine}
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
              <a href="#features" className="transition hover:text-white">
                {page.nav.features}
              </a>

              <a href="#how-it-works" className="transition hover:text-white">
                {page.nav.howItWorks}
              </a>

              <a href="#templates" className="transition hover:text-white">
                {page.nav.templates}
              </a>

              <a href="#pricing" className="transition hover:text-white">
                {page.nav.pricing}
              </a>

              <a href="#faq" className="transition hover:text-white">
                {page.nav.faq}
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white md:block"
              >
                {page.nav.login}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageOpen((open) => !open)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25 sm:px-4"
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
                          chooseLocale(language.code);
                          setLanguageOpen(false);
                        }}
                        className={`block w-full rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 ${
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
                className="rounded-full bg-white px-4 py-2.5 text-sm font-black text-[#050712] transition hover:bg-blue-100 sm:px-5"
              >
                {page.nav.start}
              </Link>
            </div>
          </div>
        </nav>

        <section className="grid min-h-[calc(100vh-90px)] items-center gap-14 py-20 lg:grid-cols-[1.04fr_0.96fr]">
          <div className={alignment}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-2 text-sm font-semibold text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              {page.hero.badge}
            </div>

            <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl md:text-7xl xl:text-[5.5rem]">
              {page.hero.title}

              <span className="mt-2 block bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
                {page.hero.titleHighlight}
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {page.hero.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-8 py-4 text-center text-base font-black shadow-2xl shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                {page.hero.primaryButton}
              </Link>

              <a
                href="#how-it-works"
                className="rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-center text-base font-bold text-white transition hover:border-white/25 hover:bg-white/[0.07]"
              >
                {page.hero.secondaryButton}
              </a>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              {page.hero.note}
            </p>

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
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-emerald-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[2rem] bg-[#f8fafc] p-5 text-slate-950">
                <div className="flex items-start justify-between gap-4">
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
                  <div className="mb-5 flex items-center justify-between gap-4">
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
                    ].map(([label, value, width, colour]) => (
                      <div key={label}>
                        <div className="mb-2 flex justify-between text-sm font-bold">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>

                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className={`h-3 rounded-full ${width} ${colour}`}
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
        </section>

        <section className="border-y border-white/10 py-8">
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
              {page.trust.label}
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-300">
              {page.trust.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
              {page.howItWorks.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {page.howItWorks.title}
            </h2>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {page.howItWorks.steps.map((step) => (
              <div
                key={step.number}
                className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 ${alignment}`}
              >
                <p className="absolute -right-2 -top-8 text-8xl font-black text-white/[0.04]">
                  {step.number}
                </p>

                <p className="text-sm font-black text-emerald-200">
                  {step.number}
                </p>

                <h3 className="mt-8 text-2xl font-black">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="py-28">
          <div className="grid items-end gap-8 lg:grid-cols-2">
            <div className={alignment}>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
                {page.featuresSection.eyebrow}
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                {page.featuresSection.title}
              </h2>
            </div>

            <p className={`max-w-xl text-lg leading-8 text-slate-400 ${alignment}`}>
              {page.featuresSection.description}
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {page.features.map((feature) => (
              <div
                key={feature.title}
                className={`group rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] ${alignment}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-xl font-black text-[#050712] transition group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="mt-7 text-xl font-black">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="templates" className="py-28">
          <div className="rounded-[3rem] border border-white/10 bg-white/[0.05] p-7 md:p-12">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className={`max-w-3xl ${alignment}`}>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-200">
                  {page.templatesSection.eyebrow}
                </p>

                <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                  {page.templatesSection.title}
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                  {page.templatesSection.description}
                </p>
              </div>

              <Link
                href="/signup"
                className="rounded-full bg-white px-6 py-3 text-center font-black text-[#050712]"
              >
                {page.templatesSection.button}
              </Link>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {page.templatesSection.templates.map((template) => (
                <div
                  key={template.label}
                  className={`rounded-[2rem] border border-white/10 bg-[#080d1d] p-6 transition hover:-translate-y-1 hover:border-violet-300/30 ${alignment}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-black text-violet-200">
                      {template.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {template.questions}
                    </span>
                  </div>

                  <div className="mt-10 rounded-2xl bg-white/[0.06] p-4">
                    <div className="h-2 w-3/4 rounded-full bg-white/20" />
                    <div className="mt-3 h-2 w-full rounded-full bg-white/10" />
                    <div className="mt-3 h-2 w-2/3 rounded-full bg-white/10" />
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {template.label}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-28">
          <div className="grid gap-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-emerald-400/5 p-7 md:p-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className={alignment}>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
                {page.aiSection.eyebrow}
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                {page.aiSection.title}
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                {page.aiSection.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {page.aiSection.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-sm font-black text-emerald-200">
                      ✓
                    </span>
                    <p className="text-sm font-bold text-slate-200">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-[#f8fafc] p-5 text-slate-950 shadow-2xl">
              <div className={`rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 ${alignment}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-black">
                    {page.aiSection.cardTitle}
                  </p>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    AI
                  </span>
                </div>

                <p className="mt-5 text-lg leading-8 text-slate-700">
                  {page.aiSection.cardText}
                </p>
              </div>

              <div className={`mt-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 ${alignment}`}>
                <p className="font-black">
                  {page.aiSection.themeTitle}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {page.aiSection.themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="audience" className="py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
              {page.audienceSection.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {page.audienceSection.title}
            </h2>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {page.audiences.map((audience) => (
              <div
                key={audience.title}
                className={`rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 ${alignment}`}
              >
                <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" />

                <h3 className="mt-7 text-2xl font-black">
                  {audience.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {audience.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-200">
              {page.pricingSection.eyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {page.pricingSection.title}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              {page.pricingSection.description}
            </p>
          </div>

          <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
            {page.plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[2.25rem] border p-8 ${
                  plan.featured
                    ? "border-violet-300/40 bg-gradient-to-b from-violet-400/15 to-white/[0.05] shadow-2xl shadow-violet-500/10"
                    : "border-white/10 bg-white/[0.05]"
                } ${alignment}`}
              >
                {plan.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-violet-300 px-4 py-2 text-xs font-black text-[#120b24]">
                    {page.pricingSection.popular}
                  </span>
                )}

                <p className="text-2xl font-black">{plan.name}</p>

                <p className="mt-4 min-h-14 leading-7 text-slate-400">
                  {plan.description}
                </p>

                <div className="mt-7 flex items-end gap-2">
                  <p className="text-5xl font-black tracking-tight">
                    {plan.price}
                  </p>

                  {plan.period && (
                    <p className="pb-1 text-sm font-bold text-slate-500">
                      {plan.period}
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-4 text-slate-300">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300/10 text-xs font-black text-emerald-200">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`mt-8 block rounded-full px-6 py-3 text-center font-black transition ${
                    plan.featured
                      ? "bg-white text-[#050712] hover:bg-blue-100"
                      : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.1]"
                  }`}
                >
                  {page.pricingSection.button}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className={alignment}>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
                {page.faqSection.eyebrow}
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                {page.faqSection.title}
              </h2>
            </div>

            <div className="space-y-4">
              {page.faqSection.items.map((item) => (
                <details
                  key={item.question}
                  className={`group rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 ${alignment}`}
                >
                  <summary className="cursor-pointer list-none text-lg font-black">
                    <span className="flex items-center justify-between gap-6">
                      {item.question}
                      <span className="text-2xl text-slate-500 transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>

                  <p className="mt-5 max-w-2xl leading-7 text-slate-400">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-emerald-400/15 p-8 text-center shadow-2xl md:p-16">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
              {page.finalCta.eyebrow}
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {page.finalCta.title}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {page.finalCta.description}
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-4 font-black text-[#050712] transition hover:bg-blue-100"
              >
                {page.finalCta.primary}
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-white/15 bg-white/[0.05] px-8 py-4 font-black text-white transition hover:bg-white/[0.1]"
              >
                {page.finalCta.secondary}
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-14">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
            <div className={alignment}>
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
                  S
                </div>

                <div>
                  <p className="font-black">SurveyMind AI</p>
                  <p className="text-xs text-slate-500">
                    {page.brandLine}
                  </p>
                </div>
              </Link>

              <p className="mt-5 max-w-sm leading-7 text-slate-400">
                {page.footer.description}
              </p>
            </div>

            <div className={alignment}>
              <p className="font-black">{page.footer.product}</p>
              <div className="mt-5 space-y-3 text-sm text-slate-400">
                <a href="#features" className="block hover:text-white">
                  {page.footer.links.features}
                </a>
                <a href="#templates" className="block hover:text-white">
                  {page.footer.links.templates}
                </a>
                <a href="#pricing" className="block hover:text-white">
                  {page.footer.links.pricing}
                </a>
              </div>
            </div>

            <div className={alignment}>
              <p className="font-black">{page.footer.company}</p>
              <div className="mt-5 space-y-3 text-sm text-slate-400">
                <span className="block">{page.footer.links.about}</span>
                <span className="block">{page.footer.links.contact}</span>
              </div>
            </div>

            <div className={alignment}>
              <p className="font-black">{page.footer.legal}</p>
              <div className="mt-5 space-y-3 text-sm text-slate-400">
                <span className="block">{page.footer.links.privacy}</span>
                <span className="block">{page.footer.links.terms}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} {page.footer.copyright}
          </div>
        </footer>
      </div>
    </main>
  );
}