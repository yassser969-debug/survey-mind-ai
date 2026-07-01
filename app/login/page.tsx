import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050712] px-4 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-16rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute bottom-[-14rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
            S
          </div>
          <p className="text-base font-black tracking-tight">SurveyMind AI</p>
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-2xl">
          <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your surveys and AI insights.
          </p>

          <form className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@university.edu"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 py-3 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            New to SurveyMind AI?{" "}
            <Link href="/login" className="font-bold text-blue-300 hover:text-blue-200">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
