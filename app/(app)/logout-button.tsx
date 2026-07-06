"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ label = "Sign out" }: { label?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-2 rounded-2xl border border-white/10 px-4 py-2.5 text-center text-xs font-bold text-slate-400 transition hover:border-white/25 hover:text-white"
    >
      {label}
    </button>
  );
}
