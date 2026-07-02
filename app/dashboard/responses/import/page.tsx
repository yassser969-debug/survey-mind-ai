"use client";

import { useState } from "react";
import Link from "next/link";

export default function ImportResponsesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <Link
          href="/dashboard/responses"
          className="text-sm font-black text-blue-600 hover:text-blue-800"
        >
          ← Back to responses
        </Link>

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black text-blue-600">Import response data</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Import response data
            </h1>
            <p className="mt-3 text-slate-500">
              Bring in existing survey responses from CSV or Excel files and map
              them into your workspace for review and analysis.
            </p>
          </div>

          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-700">
              ↑
            </div>
            <h2 className="mt-5 text-xl font-black">Upload a file</h2>
            <p className="mt-2 text-sm text-slate-500">
              Drag and drop a CSV or Excel workbook here, or choose a file from
              your device.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-400">
              Supported formats: .csv, .xlsx, .xls
            </p>

            <label className="mt-6 inline-flex cursor-pointer rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700">
              Choose file
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </label>

            {selectedFile ? (
              <p className="mt-4 text-sm font-semibold text-emerald-600">
                Selected file: {selectedFile.name}
              </p>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-black">How it works</h2>
              <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <li className="rounded-2xl bg-white p-4">
                  <span className="mr-2 font-black text-blue-600">1.</span>
                  Upload your file to begin the import process.
                </li>
                <li className="rounded-2xl bg-white p-4">
                  <span className="mr-2 font-black text-blue-600">2.</span>
                  Match each column to the fields in SurveyMind AI.
                </li>
                <li className="rounded-2xl bg-white p-4">
                  <span className="mr-2 font-black text-blue-600">3.</span>
                  Review the imported rows and confirm the import.
                </li>
              </ol>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black">Important notes</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <li className="rounded-2xl bg-slate-50 p-4">
                  First row must contain column names.
                </li>
                <li className="rounded-2xl bg-slate-50 p-4">
                  One row per respondent is required.
                </li>
                <li className="rounded-2xl bg-slate-50 p-4">
                  Do not upload sensitive personal data.
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/responses"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="button"
              disabled={!selectedFile}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Import
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
