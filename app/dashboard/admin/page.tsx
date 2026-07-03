import { redirect } from "next/navigation";
import { FOUNDER_EMAIL, getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { banUser, unbanUser } from "@/lib/actions/admin";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  banned_at: string | null;
  created_at: string;
  survey_count: number;
  response_count: number;
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const db = getDb();

  const totals = db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM users) AS users,
         (SELECT COUNT(*) FROM users WHERE role = 'student') AS students,
         (SELECT COUNT(*) FROM users WHERE role = 'lecturer') AS lecturers,
         (SELECT COUNT(*) FROM users WHERE email_verified_at IS NOT NULL) AS verified,
         (SELECT COUNT(*) FROM users WHERE banned_at IS NOT NULL) AS banned,
         (SELECT COUNT(*) FROM surveys) AS surveys,
         (SELECT COUNT(*) FROM responses) AS responses,
         (SELECT COUNT(*) FROM branches) AS branches`
    )
    .get() as Record<string, number>;

  const users = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.email_verified_at,
              u.banned_at, u.created_at,
              COUNT(DISTINCT s.id) AS survey_count,
              COUNT(r.id) AS response_count
       FROM users u
       LEFT JOIN surveys s ON s.owner_id = u.id
       LEFT JOIN responses r ON r.survey_id = s.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    )
    .all() as UserRow[];

  const tiles = [
    { label: "Subscribers", value: totals.users },
    { label: "Students", value: totals.students },
    { label: "Lecturers", value: totals.lecturers },
    { label: "Verified emails", value: totals.verified },
    { label: "Blocked", value: totals.banned },
    { label: "Surveys", value: totals.surveys },
    { label: "Responses", value: totals.responses },
    { label: "Branches", value: totals.branches },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight">Founder panel</h1>
        <span className="rounded-full bg-gradient-to-r from-blue-400/20 via-violet-400/20 to-emerald-300/20 px-4 py-1.5 text-xs font-black text-blue-200">
          👑 Full control
        </span>
      </div>
      <p className="mt-2 text-slate-400">
        Follow every account, block emails, and track your subscribers.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5"
          >
            <p className="text-xs font-bold text-slate-400">{tile.label}</p>
            <p className="mt-1 text-3xl font-black">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
        <h2 className="text-xl font-black">All accounts</h2>
        <table className="mt-5 w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="text-left text-xs font-black uppercase tracking-wider text-slate-500">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Surveys</th>
              <th className="pb-3 pr-4">Responses</th>
              <th className="pb-3 pr-4">Joined</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => {
              const isFounder = row.email === FOUNDER_EMAIL;
              return (
                <tr
                  key={row.id}
                  className="border-t border-white/5 text-slate-300"
                >
                  <td className="py-3 pr-4">
                    <p className="font-bold text-white">
                      {row.name} {isFounder && "👑"}
                    </p>
                    <p className="text-xs text-slate-500">{row.email}</p>
                  </td>
                  <td className="py-3 pr-4 capitalize">
                    {isFounder ? "Founder" : row.role}
                  </td>
                  <td className="py-3 pr-4">
                    {row.banned_at ? (
                      <span className="rounded-full bg-rose-300/15 px-3 py-1 text-xs font-black text-rose-200">
                        Blocked
                      </span>
                    ) : row.email_verified_at ? (
                      <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-black text-emerald-200">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-black text-amber-200">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">{row.survey_count}</td>
                  <td className="py-3 pr-4">{row.response_count}</td>
                  <td className="py-3 pr-4 text-xs text-slate-500">
                    {row.created_at}
                  </td>
                  <td className="py-3">
                    {isFounder || row.id === user.id ? (
                      <span className="text-xs text-slate-600">—</span>
                    ) : row.banned_at ? (
                      <form action={unbanUser}>
                        <input type="hidden" name="userId" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-emerald-300/40 px-4 py-1.5 text-xs font-black text-emerald-200 transition hover:bg-emerald-400/10"
                        >
                          Unblock
                        </button>
                      </form>
                    ) : (
                      <form action={banUser}>
                        <input type="hidden" name="userId" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-rose-300/40 px-4 py-1.5 text-xs font-black text-rose-200 transition hover:bg-rose-400/10"
                        >
                          Block
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
