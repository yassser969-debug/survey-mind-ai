import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n";
import LanguageSwitcher from "@/app/components/language-switcher";
import LoginForm from "./login-form";

export default async function LoginPage() {
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

      <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl md:p-12">
          <div className="mb-10 flex items-start justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
                S
              </div>
              <div>
                <p className="font-black">{t.common.appName}</p>
                <p className="text-sm text-slate-400">{t.common.tagline}</p>
              </div>
            </Link>
            <LanguageSwitcher current={locale} />
          </div>

          <h1 className="text-4xl font-black tracking-[-0.03em]">
            {t.login.title}
          </h1>
          <p className="mt-3 text-slate-400">{t.login.subtitle}</p>

          <LoginForm t={t.login} />
        </div>
      </section>
    </main>
  );
}
