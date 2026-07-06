import { randomUUID } from "node:crypto";
import { db } from "./db";

export type QuestionType = "short" | "long" | "choice" | "rating";

export type QuestionInput = {
  text: string;
  type: QuestionType;
  options: string[];
};

export type Question = QuestionInput & { id: string };

export type Survey = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "live" | "draft" | "closed";
  createdAt: string;
  updatedAt: string;
};

export function createSurvey(
  userId: string,
  title: string,
  description: string,
  questions: QuestionInput[],
) {
  const surveyId = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO surveys (id, user_id, title, description, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'live', ?, ?)`,
  ).run(surveyId, userId, title, description, now, now);

  const insertQuestion = db.prepare(
    `INSERT INTO questions (id, survey_id, text, type, options, position)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  questions.forEach((q, index) => {
    insertQuestion.run(randomUUID(), surveyId, q.text, q.type, JSON.stringify(q.options), index);
  });

  return surveyId;
}

export function getSurvey(surveyId: string): { survey: Survey; questions: Question[] } | null {
  const survey = db
    .prepare(
      `SELECT id, user_id as userId, title, description, status, created_at as createdAt, updated_at as updatedAt
       FROM surveys WHERE id = ?`,
    )
    .get(surveyId) as Survey | undefined;

  if (!survey) return null;

  const rows = db
    .prepare(`SELECT id, text, type, options FROM questions WHERE survey_id = ? ORDER BY position ASC`)
    .all(surveyId) as { id: string; text: string; type: QuestionType; options: string }[];

  const questions: Question[] = rows.map((row) => ({
    id: row.id,
    text: row.text,
    type: row.type,
    options: JSON.parse(row.options),
  }));

  return { survey, questions };
}

export function listSurveysForUser(userId: string) {
  const surveys = db
    .prepare(
      `SELECT id, user_id as userId, title, description, status, created_at as createdAt, updated_at as updatedAt
       FROM surveys WHERE user_id = ? ORDER BY updated_at DESC`,
    )
    .all(userId) as Survey[];

  return surveys.map((survey) => {
    const responseCount = (
      db.prepare(`SELECT COUNT(*) as count FROM responses WHERE survey_id = ?`).get(survey.id) as {
        count: number;
      }
    ).count;

    const questionCount = (
      db.prepare(`SELECT COUNT(*) as count FROM questions WHERE survey_id = ?`).get(survey.id) as {
        count: number;
      }
    ).count;

    const answeredCount = questionCount
      ? (
          db
            .prepare(
              `SELECT COUNT(*) as count FROM answers a
               JOIN responses r ON r.id = a.response_id
               WHERE r.survey_id = ?`,
            )
            .get(survey.id) as { count: number }
        ).count
      : 0;

    const completion =
      responseCount && questionCount
        ? Math.round((answeredCount / (responseCount * questionCount)) * 100)
        : 0;

    return { ...survey, responseCount, completion };
  });
}

export function addResponse(surveyId: string, answers: Record<string, string>) {
  const responseId = randomUUID();
  const now = new Date().toISOString();

  db.prepare(`INSERT INTO responses (id, survey_id, created_at) VALUES (?, ?, ?)`).run(
    responseId,
    surveyId,
    now,
  );

  const insertAnswer = db.prepare(
    `INSERT INTO answers (id, response_id, question_id, value) VALUES (?, ?, ?, ?)`,
  );

  for (const [questionId, value] of Object.entries(answers)) {
    if (!value) continue;
    insertAnswer.run(randomUUID(), responseId, questionId, value);
  }

  return responseId;
}

export function getResponses(surveyId: string) {
  const responses = db
    .prepare(`SELECT id, created_at as createdAt FROM responses WHERE survey_id = ? ORDER BY created_at DESC`)
    .all(surveyId) as { id: string; createdAt: string }[];

  const getAnswers = db.prepare(
    `SELECT question_id as questionId, value FROM answers WHERE response_id = ?`,
  );

  return responses.map((response) => ({
    ...response,
    answers: getAnswers.all(response.id) as { questionId: string; value: string }[],
  }));
}
