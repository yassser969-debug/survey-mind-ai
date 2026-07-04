"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { getDb } from "../db";
import { getCurrentUser } from "../auth";
import { checkRateLimit } from "../rate-limit";
import type { FormState } from "./auth";

export async function createSurvey(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };

  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const questions = String(formData.get("questions") ?? "")
    .split("\n")
    .map((line) => line.trim().slice(0, 500))
    .filter(Boolean)
    .slice(0, 50);

  if (title.length < 3) return { error: "Please enter a survey title." };
  if (questions.length === 0)
    return { error: "Please add at least one question (one per line)." };

  const id = randomBytes(6).toString("base64url");
  getDb()
    .prepare(
      "INSERT INTO surveys (id, owner_id, title, questions) VALUES (?, ?, ?, ?)"
    )
    .run(id, user.id, title, JSON.stringify(questions));

  revalidatePath("/dashboard/my-surveys");
  return null;
}

async function setSurveyStatus(
  surveyId: string,
  status: "active" | "closed"
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };

  const db = getDb();
  const survey = db
    .prepare("SELECT owner_id, status FROM surveys WHERE id = ?")
    .get(surveyId) as { owner_id: number; status: string } | undefined;

  if (!survey) return { error: "Survey not found." };
  if (survey.owner_id !== user.id && user.role !== "admin") {
    return { error: "You do not have access to this survey." };
  }

  if (status === "active") {
    db.prepare(
      `UPDATE surveys
       SET status = 'active',
           activated_at = COALESCE(activated_at, datetime('now')),
           closed_at = NULL
       WHERE id = ?`
    ).run(surveyId);
  } else {
    db.prepare(
      "UPDATE surveys SET status = 'closed', closed_at = datetime('now') WHERE id = ?"
    ).run(surveyId);
  }

  revalidatePath("/dashboard/my-surveys");
  return null;
}

export async function activateSurvey(formData: FormData): Promise<void> {
  await setSurveyStatus(String(formData.get("surveyId") ?? ""), "active");
}

export async function closeSurvey(formData: FormData): Promise<void> {
  await setSurveyStatus(String(formData.get("surveyId") ?? ""), "closed");
}

export type SubmitState = { error?: string; ok?: boolean } | null;

export async function submitResponse(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const surveyId = String(formData.get("surveyId") ?? "").slice(0, 32);

  // Slow down automated spam on public survey links.
  if (!checkRateLimit(`respond:${surveyId}`, 30, 60)) {
    return { error: "Too many submissions right now. Please try again in a minute." };
  }

  const db = getDb();
  const survey = db
    .prepare("SELECT questions, status FROM surveys WHERE id = ?")
    .get(surveyId) as { questions: string; status: string } | undefined;

  if (!survey) return { error: "Survey not found." };
  if (survey.status !== "active")
    return { error: "This survey is not accepting responses." };

  const questions = JSON.parse(survey.questions) as string[];
  const answers = questions.map((_, index) =>
    String(formData.get(`answer-${index}`) ?? "").trim().slice(0, 5000)
  );

  if (answers.every((answer) => !answer)) {
    return { error: "Please answer at least one question." };
  }

  db.prepare("INSERT INTO responses (survey_id, answers) VALUES (?, ?)").run(
    surveyId,
    JSON.stringify(answers)
  );

  return { ok: true };
}
