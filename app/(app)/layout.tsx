import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDict, getLang } from "@/lib/i18n";
import LogoutButton from "./logout-button";
import LanguageToggle from "../language-toggle";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");

  const lang = await getLang();
  const t = getDict(lang);

  const navItems = [
    { href: "/dashboard", label: t.dashboard, icon: "▦" },
    { href: "/surveys/new", label: t.surveys, icon: "▤" },
    { href: "/dashboard", label: t.responses, icon: "◧" },
    { href: "/dashboard", label: t.aiInsightsNav, icon: "✦" },
  ];

  return (
    <div className="min-h-screen bg-[#050712] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute end-[-12rem] top-[14rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[100rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl lg:flex">
          <Link href="/" className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-base font-black text-[#050712] shadow-lg shadow-blue-500/20">
              S
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">SurveyMind AI</p>
              <p className="text-xs text-slate-400">{t.workspace}</p>
            </div>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <LanguageToggle
            lang={lang}
            className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-center text-xs font-bold text-slate-300 hover:border-white/25"
          />

          <Link
            href="/surveys/new"
            className="rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-4 py-3 text-center text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
          >
            {t.newSurvey}
          </Link>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
            <LogoutButton label={t.signOut} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
