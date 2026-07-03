import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";

const roleLabels: Record<string, string> = {
  admin: "Founder",
  student: "Student",
  lecturer: "Lecturer",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.emailVerifiedAt)
    redirect(`/verify?email=${encodeURIComponent(user.email)}`);

  return (
    <div className="min-h-screen bg-[#050712] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b16]/90 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-sm font-black text-[#050712]">
                S
              </span>
              <span className="text-sm font-black">SurveyMind AI</span>
            </Link>

            <nav className="flex items-center gap-1 text-sm font-bold text-slate-300">
              <Link
                href="/dashboard/my-surveys"
                className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
              >
                My surveys
              </Link>
              {user.role === "lecturer" && (
                <Link
                  href="/dashboard/branch"
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
                >
                  My branch
                </Link>
              )}
              {user.role === "student" && (
                <Link
                  href="/dashboard/join"
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
                >
                  Join a branch
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  href="/dashboard/admin"
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
                >
                  👑 Founder panel
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-black leading-4">{user.name}</p>
              <p className="text-xs text-slate-400">
                {roleLabels[user.role]}
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-rose-300/40 hover:text-rose-200"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
