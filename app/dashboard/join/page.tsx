import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import JoinBranchForm from "./join-branch-form";

type JoinedBranch = { name: string; lecturer: string; joined_at: string };

export default async function JoinPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/dashboard");

  const branches = getDb()
    .prepare(
      `SELECT b.name, u.name AS lecturer, m.joined_at
       FROM branch_members m
       JOIN branches b ON b.id = m.branch_id
       JOIN users u ON u.id = b.lecturer_id
       WHERE m.student_id = ?
       ORDER BY m.joined_at DESC`
    )
    .all(user.id) as JoinedBranch[];

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-black tracking-tight">Join a branch</h1>
      <p className="mt-2 text-slate-400">
        Once you join, your lecturer can follow your surveys and progress.
      </p>

      <div className="mt-8">
        <JoinBranchForm />
      </div>

      {branches.length > 0 && (
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <h2 className="text-xl font-black">Your branches</h2>
          <ul className="mt-4 space-y-3">
            {branches.map((branch, index) => (
              <li
                key={index}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/[0.04] px-4 py-3"
              >
                <span className="font-bold">{branch.name}</span>
                <span className="text-sm text-slate-400">
                  Lecturer: {branch.lecturer}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
