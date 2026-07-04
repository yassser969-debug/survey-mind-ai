"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050712] px-6 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-rose-500/15 blur-[140px]" />
      </div>

      <div className="relative max-w-xl text-center">
        <p className="text-5xl">⚠️</p>
        <h1 className="mt-4 text-2xl font-black">Something went wrong</h1>
        <p className="mt-3 leading-7 text-slate-400">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 px-8 py-4 font-black shadow-2xl shadow-blue-500/20 transition hover:-translate-y-0.5"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
