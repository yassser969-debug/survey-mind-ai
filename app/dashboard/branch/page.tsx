import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { collectionDuration } from "@/lib/format";
import CreateBranchForm from "./create-branch-form";

type BranchRow = { id: number; name: string; join_code: string };

type StudentRow = { id: number; name: string; email: string; joined_at: string };

type StudentSurveyRow = {
  title: string;
  status: string;
  questions: string;
  activated_at: string | null;
  closed_at: string | null;
  response_count: number;
};

export default async function BranchPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "lecturer" && user.role !== "admin") redirect("/dashboard");

  const db = getDb();
  const branches = db
    .prepare(
      "SELECT id, name, join_code FROM branches WHERE lecturer_id = ? ORDER BY id DESC"
    )
    .all(user.id) as BranchRow[];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-black tracking-tight">My branch</h1>
      <p className="mt-2 text-slate-400">
        Share the join code with your students, then follow how they build
        their surveys: question counts, responses, and collection time.
      </p>

      <div className="mt-8">
        <CreateBranchForm />
      </div>

      <div className="mt-8 space-y-8">
        {branches.map((branch) => {
          const students = db
            .prepare(
              `SELECT u.id, u.name, u.email, m.joined_at
               FROM branch_members m
               JOIN users u ON u.id = m.student_id
               WHERE m.branch_id = ?
               ORDER BY m.joined_at`
            )
            .all(branch.id) as StudentRow[];

          return (
            <section
              key={branch.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black">{branch.name}</h2>
                <p className="text-sm font-bold text-slate-300">
                  Join code:{" "}
                  <code className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-1.5 text-base font-black tracking-[0.25em] text-emerald-200">
                    {branch.join_code}
                  </code>
                </p>
              </div>

              {students.length === 0 ? (
                <p className="mt-6 rounded-2xl bg-white/[0.04] p-6 text-center text-slate-400">
                  No students yet — share the join code above.
                </p>
              ) : (
                <div className="mt-6 space-y-6">
                  {students.map((student) => {
                    const surveys = db
                      .prepare(
                        `SELECT s.title, s.status, s.questions, s.activated_at,
                                s.closed_at, COUNT(r.id) AS response_count
                         FROM surveys s
                         LEFT JOIN responses r ON r.survey_id = s.id
                         WHERE s.owner_id = ?
                         GROUP BY s.id
                         ORDER BY s.created_at DESC`
                      )
                      .all(student.id) as StudentSurveyRow[];

                    return (
                      <div
                        key={student.id}
                        className="rounded-2xl border border-white/10 bg-[#080d1d] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-black">{student.name}</p>
                            <p className="text-xs text-slate-500">
                              {student.email} · joined {student.joined_at} UTC
                            </p>
                          </div>
                          <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-black text-blue-200">
                            {surveys.length} surveys
                          </span>
                        </div>

                        {surveys.length > 0 && (
                          <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[36rem] text-sm">
                              <thead>
                                <tr className="text-left text-xs font-black uppercase tracking-wider text-slate-500">
                                  <th className="pb-2 pr-4">Survey</th>
                                  <th className="pb-2 pr-4">Status</th>
                                  <th className="pb-2 pr-4">Questions</th>
                                  <th className="pb-2 pr-4">Responses</th>
                                  <th className="pb-2">Collection time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {surveys.map((survey, index) => (
                                  <tr
                                    key={index}
                                    className="border-t border-white/5 text-slate-300"
                                  >
                                    <td className="py-2.5 pr-4 font-bold text-white">
                                      {survey.title}
                                    </td>
                                    <td className="py-2.5 pr-4 capitalize">
                                      {survey.status}
                                    </td>
                                    <td className="py-2.5 pr-4">
                                      {(JSON.parse(survey.questions) as string[]).length}
                                    </td>
                                    <td className="py-2.5 pr-4">
                                      {survey.response_count}
                                    </td>
                                    <td className="py-2.5">
                                      {collectionDuration(
                                        survey.activated_at,
                                        survey.closed_at
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
