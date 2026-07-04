import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050712] px-6 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
      </div>

      <div className="relative max-w-xl text-center">
        <p className="text-7xl font-black tracking-tight">404</p>
        <h1 className="mt-4 text-2xl font-black">This page does not exist</h1>
        <p className="mt-3 leading-7 text-slate-400">
          The link may be wrong, or the page may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-8 py-4 font-black shadow-2xl shadow-blue-500/20 transition hover:-translate-y-0.5"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
