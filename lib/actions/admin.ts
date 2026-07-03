"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "../db";
import { FOUNDER_EMAIL, getCurrentUser } from "../auth";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function banUser(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const userId = Number(formData.get("userId"));
  const db = getDb();

  const target = db
    .prepare("SELECT id, email FROM users WHERE id = ?")
    .get(userId) as { id: number; email: string } | undefined;

  // The founder account can never be blocked, and admins cannot block themselves.
  if (!target || target.email === FOUNDER_EMAIL || target.id === admin.id) {
    return;
  }

  db.prepare(
    "UPDATE users SET banned_at = datetime('now') WHERE id = ?"
  ).run(userId);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);

  revalidatePath("/dashboard/admin");
}

export async function unbanUser(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const userId = Number(formData.get("userId"));
  getDb().prepare("UPDATE users SET banned_at = NULL WHERE id = ?").run(userId);

  revalidatePath("/dashboard/admin");
}
