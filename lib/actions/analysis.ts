"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "../db";
import { getCurrentUser } from "../auth";
import { runSurveyAnalysis } from "../analysis";
import type { FormState } from "./auth";

export async function analyzeSurvey(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };

  const surveyId = String(formData.get("surveyId") ?? "");
  const survey = getDb()
    .prepare("SELECT owner_id FROM surveys WHERE id = ?")
    .get(surveyId) as { owner_id: number } | undefined;

  if (!survey) return { error: "Survey not found." };
  if (survey.owner_id !== user.id && user.role !== "admin") {
    return { error: "You do not have access to this survey." };
  }

  const hasResponses = getDb()
    .prepare("SELECT 1 FROM responses WHERE survey_id = ? LIMIT 1")
    .get(surveyId);
  if (!hasResponses) {
    return { error: "This survey has no responses to analyse yet." };
  }

  try {
    await runSurveyAnalysis(surveyId);
  } catch {
    return { error: "Analysis failed. Please try again." };
  }

  revalidatePath("/dashboard/analysis");
  return null;
}
