import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050712] px-6 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute right-[-10rem] bottom-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[130px]" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl md:p-12">
          <Link href="/" className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 text-lg font-black text-[#050712]">
              S
            </div>
            <div>
              <p className="font-black">SurveyMind AI</p>
              <p className="text-sm text-slate-400">AI survey intelligence</p>
            </div>
          </Link>

          <h1 className="text-4xl font-black tracking-[-0.03em]">
            Welcome back
          </h1>
          <p className="mt-3 text-slate-400">
            Sign in to continue to your survey workspace.
          </p>

          <form className="mt-10 space-y-5">
            <div>
              <label className="text-sm font-bold text-slate-300">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-300">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-300"
              />
            </div>

            <Link
              href="/dashboard"
              className="block rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 px-6 py-4 text-center font-black shadow-2xl shadow-blue-500/25 transition hover:scale-[1.01]"
            >
              Sign in
            </Link>

            <p className="text-center text-sm text-slate-400">
              New to SurveyMind AI?{" "}
              <Link href="/signup" className="font-bold text-blue-200 hover:text-white">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}