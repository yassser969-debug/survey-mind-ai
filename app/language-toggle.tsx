"use client";

import type { Lang } from "@/lib/i18n-data";
import { setClientLang } from "@/lib/i18n-client";

export default function LanguageToggle({
  lang,
  className,
}: {
  lang: Lang;
  className?: string;
}) {
  function toggle() {
    setClientLang(lang === "ar" ? "en" : "ar");
    window.location.reload();
  }

  return (
    <button
      onClick={toggle}
      className={
        className ??
        "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-white/25"
      }
    >
      {lang === "ar" ? "🌐 EN" : "🌐 عربي"}
    </button>
  );
}
