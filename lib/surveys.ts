import { randomUUID } from "node:crypto";
import { ensureSchema, sql } from "./db";

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

export async function createSurvey(
  userId: string,
  title: string,
  description: string,
  questions: QuestionInput[],
) {
  await ensureSchema();

  const surveyId = randomUUID();
  const now = new Date().toISOString();

  await sql`
    INSERT INTO surveys (id, user_id, title, description, status, created_at, updated_at)
    VALUES (${surveyId}, ${userId}, ${title}, ${description}, 'live', ${now}, ${now})
  `;

  await Promise.all(
    questions.map((q, index) =>
      sql`
        INSERT INTO questions (id, survey_id, text, type, options, position)
        VALUES (${randomUUID()}, ${surveyId}, ${q.text}, ${q.type}, ${JSON.stringify(q.options)}, ${index})
      `,
    ),
  );

  return surveyId;
}

export async function getSurvey(
  surveyId: string,
): Promise<{ survey: Survey; questions: Question[] } | null> {
  await ensureSchema();

  const [survey] = await sql<Survey[]>`
    SELECT id, user_id as "userId", title, description, status, created_at as "createdAt", updated_at as "updatedAt"
    FROM surveys WHERE id = ${surveyId}
  `;

  if (!survey) return null;

  const rows = await sql<{ id: string; text: string; type: QuestionType; options: string }[]>`
    SELECT id, text, type, options FROM questions WHERE survey_id = ${surveyId} ORDER BY position ASC
  `;

  const questions: Question[] = rows.map((row) => ({
    id: row.id,
    text: row.text,
    type: row.type,
    options: JSON.parse(row.options),
  }));

  return { survey, questions };
}

export async function listSurveysForUser(userId: string) {
  await ensureSchema();

  const surveys = await sql<Survey[]>`
    SELECT id, user_id as "userId", title, description, status, created_at as "createdAt", updated_at as "updatedAt"
    FROM surveys WHERE user_id = ${userId} ORDER BY updated_at DESC
  `;

  return Promise.all(
    surveys.map(async (survey) => {
      const [{ count: responseCount }] = await sql<{ count: number }[]>`
        SELECT COUNT(*)::int as count FROM responses WHERE survey_id = ${survey.id}
      `;
      const [{ count: questionCount }] = await sql<{ count: number }[]>`
        SELECT COUNT(*)::int as count FROM questions WHERE survey_id = ${survey.id}
      `;
      const [{ count: answeredCount }] = questionCount
        ? await sql<{ count: number }[]>`
            SELECT COUNT(*)::int as count FROM answers a
            JOIN responses r ON r.id = a.response_id
            WHERE r.survey_id = ${survey.id}
          `
        : [{ count: 0 }];

      const completion =
        responseCount && questionCount
          ? Math.round((answeredCount / (responseCount * questionCount)) * 100)
          : 0;

      return { ...survey, responseCount, completion };
    }),
  );
}

export async function addResponse(surveyId: string, answers: Record<string, string>) {
  await ensureSchema();

  const responseId = randomUUID();
  const now = new Date().toISOString();

  await sql`INSERT INTO responses (id, survey_id, created_at) VALUES (${responseId}, ${surveyId}, ${now})`;

  const entries = Object.entries(answers).filter(([, value]) => value);
  await Promise.all(
    entries.map(([questionId, value]) =>
      sql`INSERT INTO answers (id, response_id, question_id, value) VALUES (${randomUUID()}, ${responseId}, ${questionId}, ${value})`,
    ),
  );

  return responseId;
}

export async function getResponses(surveyId: string) {
  await ensureSchema();

  const responses = await sql<{ id: string; createdAt: string }[]>`
    SELECT id, created_at as "createdAt" FROM responses WHERE survey_id = ${surveyId} ORDER BY created_at DESC
  `;

  const answers = await sql<{ responseId: string; questionId: string; value: string }[]>`
    SELECT a.response_id as "responseId", a.question_id as "questionId", a.value
    FROM answers a
    JOIN responses r ON r.id = a.response_id
    WHERE r.survey_id = ${surveyId}
  `;

  const answersByResponse = new Map<string, { questionId: string; value: string }[]>();
  for (const answer of answers) {
    const list = answersByResponse.get(answer.responseId) ?? [];
    list.push({ questionId: answer.questionId, value: answer.value });
    answersByResponse.set(answer.responseId, list);
  }

  return responses.map((response) => ({
    ...response,
    answers: answersByResponse.get(response.id) ?? [],
  }));
}
