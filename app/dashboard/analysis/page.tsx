import Link from "next/link";

export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="text-sm font-black text-blue-600 hover:text-blue-800"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black text-violet-600">AI analysis</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            AI analysis
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Review auto-generated summaries, emerging themes, and response trends
            once your survey data is ready.
          </p>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-black">Coming soon</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This section is ready for deeper AI-driven analysis workflows and
              will be expanded as the product evolves.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
