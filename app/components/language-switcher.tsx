import { setLocale } from "@/lib/actions/locale";
import type { Locale } from "@/lib/i18n";

const options: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "عربي" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher({ current }: { current: Locale }) {
  return (
    <form
      action={setLocale}
      className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
    >
      {options.map((option) => (
        <button
          key={option.code}
          type="submit"
          name="locale"
          value={option.code}
          className={`rounded-full px-3 py-1.5 text-xs font-black transition ${
            current === option.code
              ? "bg-white text-[#050712]"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </form>
  );
}
