import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n";
import LanguageSwitcher from "@/app/components/language-switcher";
import SignupForm from "./signup-form";

export default async function SignupPage() {
  const t = await getDict();
  const locale = await getLocale();

  return (
    <main
      dir={t.dir}
      className="min-h-screen bg-[#050712] px-6 py-10 text-white"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute right-[-10rem] bottom-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[130px]" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-2xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-emerald-400/10 p-10 lg:block">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
                S
              </div>
              <div>
                <p className="font-black">{t.common.appName}</p>
                <p className="text-sm text-slate-300">{t.common.tagline}</p>
              </div>
            </Link>

            <div className="mt-24">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">
                {t.signup.heroEyebrow}
              </p>
              <h1 className="mt-6 text-5xl font-black leading-tight tracking-[-0.04em]">
                {t.signup.heroTitle1}
                <span className="block text-blue-200">
                  {t.signup.heroTitle2}
                </span>
                {t.signup.heroTitle3}
              </h1>
              <p className="mt-6 max-w-md leading-8 text-slate-300">
                {t.signup.heroText}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex text-sm font-bold text-slate-300 hover:text-white"
              >
                {t.common.backToHome}
              </Link>
              <LanguageSwitcher current={locale} />
            </div>

            <div>
              <h2 className="text-4xl font-black tracking-[-0.03em]">
                {t.signup.title}
              </h2>
              <p className="mt-3 text-slate-400">{t.signup.subtitle}</p>
            </div>

            <SignupForm t={t.signup} />
          </div>
        </div>
      </section>
    </main>
  );
}
