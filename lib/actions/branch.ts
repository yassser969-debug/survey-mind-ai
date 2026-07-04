"use server";

import { revalidatePath } from "next/cache";
import { randomInt } from "node:crypto";
import { getDb } from "../db";
import { getCurrentUser } from "../auth";
import { getDict } from "../i18n";
import type { FormState } from "./auth";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newJoinCode(): string {
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

export async function createBranch(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const user = await getCurrentUser();
  if (!user || (user.role !== "lecturer" && user.role !== "admin")) {
    return { error: t.lecturerOnly };
  }

  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  if (name.length < 2) return { error: t.branchName };

  const db = getDb();
  let code = newJoinCode();
  while (db.prepare("SELECT 1 FROM branches WHERE join_code = ?").get(code)) {
    code = newJoinCode();
  }

  db.prepare(
    "INSERT INTO branches (lecturer_id, name, join_code) VALUES (?, ?, ?)"
  ).run(user.id, name, code);

  revalidatePath("/dashboard/branch");
  return null;
}

export async function joinBranch(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const t = (await getDict()).errors;
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    return { error: t.studentOnly };
  }

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: t.enterCode };

  const db = getDb();
  const branch = db
    .prepare("SELECT id FROM branches WHERE join_code = ?")
    .get(code) as { id: number } | undefined;

  if (!branch) return { error: t.branchNotFound };

  const already = db
    .prepare(
      "SELECT 1 FROM branch_members WHERE branch_id = ? AND student_id = ?"
    )
    .get(branch.id, user.id);
  if (already) return { error: t.alreadyJoined };

  db.prepare(
    "INSERT INTO branch_members (branch_id, student_id) VALUES (?, ?)"
  ).run(branch.id, user.id);

  revalidatePath("/dashboard/join");
  return null;
}
