import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  survey_count: number;
  response_count: number;
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const users = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.email_verified_at, u.created_at,
              COUNT(DISTINCT s.id) AS survey_count,
              COUNT(r.id) AS response_count
       FROM users u
       LEFT JOIN surveys s ON s.owner_id = u.id
       LEFT JOIN responses r ON r.survey_id = s.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    )
    .all() as UserRow[];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-black tracking-tight">Administration</h1>
      <p className="mt-2 text-slate-400">
        Every account on the platform, with surveys and collected responses.
      </p>

      <div className="mt-8 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
        <table className="w-full min-w-[42rem] text-sm">
          <thead>
            <tr className="text-left text-xs font-black uppercase tracking-wider text-slate-500">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3 pr-4">Verified</th>
              <th className="pb-3 pr-4">Surveys</th>
              <th className="pb-3 pr-4">Responses</th>
              <th className="pb-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.id} className="border-t border-white/5 text-slate-300">
                <td className="py-3 pr-4">
                  <p className="font-bold text-white">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.email}</p>
                </td>
                <td className="py-3 pr-4 capitalize">{row.role}</td>
                <td className="py-3 pr-4">
                  {row.email_verified_at ? (
                    <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-black text-emerald-200">
                      Yes
                    </span>
                  ) : (
                    <span className="rounded-full bg-rose-300/10 px-3 py-1 text-xs font-black text-rose-200">
                      No
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4">{row.survey_count}</td>
                <td className="py-3 pr-4">{row.response_count}</td>
                <td className="py-3 text-xs text-slate-500">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
