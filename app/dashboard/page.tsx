import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDict } from "@/lib/i18n";
import { fmt } from "@/lib/i18n/format";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = (await getDict()).overview;
  const db = getDb();

  const stats = db
    .prepare(
      `SELECT
         COUNT(DISTINCT s.id) AS surveys,
         COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.id END) AS active_surveys,
         COUNT(r.id) AS responses
       FROM surveys s
       LEFT JOIN responses r ON r.survey_id = s.id
       WHERE s.owner_id = ?`
    )
    .get(user.id) as {
    surveys: number;
    active_surveys: number;
    responses: number;
  };

  const analysesCount = (
    db
      .prepare(
        `SELECT COUNT(a.id) AS count
         FROM analyses a
         JOIN surveys s ON s.id = a.survey_id
         WHERE s.owner_id = ?`
      )
      .get(user.id) as { count: number }
  ).count;

  const recentResponses = db
    .prepare(
      `SELECT r.id, r.submitted_at, s.title
       FROM responses r
       JOIN surveys s ON s.id = r.survey_id
       WHERE s.owner_id = ?
       ORDER BY r.id DESC LIMIT 5`
    )
    .all(user.id) as { id: number; submitted_at: string; title: string }[];

  const tiles = [
    { label: t.tileSurveys, value: stats.surveys, href: "/dashboard/my-surveys" },
    { label: t.tileActive, value: stats.active_surveys, href: "/dashboard/my-surveys" },
    { label: t.tileResponses, value: stats.responses, href: "/dashboard/responses" },
    { label: t.tileAnalyses, value: analysesCount, href: "/dashboard/analysis" },
  ];

  const actions = [
    { title: t.actionCreate, text: t.actionCreateText, href: "/dashboard/my-surveys", icon: "✦" },
    { title: t.actionReview, text: t.actionReviewText, href: "/dashboard/responses", icon: "◉" },
    { title: t.actionAnalyse, text: t.actionAnalyseText, href: "/dashboard/analysis", icon: "▦" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-black tracking-tight">
        {fmt(t.welcome, { name: user.name.split(" ")[0] })}
      </h1>
      <p className="mt-2 text-slate-400">{t.subtitle}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-0.5 hover:border-white/25"
          >
            <p className="text-sm font-bold text-slate-400">{tile.label}</p>
            <p className="mt-2 text-4xl font-black">{tile.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <h2 className="text-xl font-black">{t.latest}</h2>
          {recentResponses.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-white/[0.04] p-6 text-center text-slate-400">
              {t.empty}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentResponses.map((response) => (
                <li
                  key={response.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/[0.04] px-4 py-3"
                >
                  <span className="font-bold">{response.title}</span>
                  <span dir="ltr" className="text-xs text-slate-500">
                    {response.submitted_at} UTC
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-start gap-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 transition hover:-translate-y-0.5 hover:border-white/25"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
                {action.icon}
              </span>
              <span>
                <span className="block font-black">{action.title}</span>
                <span className="mt-1 block text-sm text-slate-400">
                  {action.text}
                </span>
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
