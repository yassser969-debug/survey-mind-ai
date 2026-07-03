import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { getDb } from "./db";

export type AnalysisResult = {
  summary: string;
  sentiment: "positive" | "mixed" | "negative" | "neutral";
  themes: { name: string; description: string }[];
  recommendations: string[];
};

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description:
        "A clear 3-5 sentence summary of what the responses say overall.",
    },
    sentiment: {
      type: "string",
      enum: ["positive", "mixed", "negative", "neutral"],
    },
    themes: {
      type: "array",
      description: "The 3-5 most important recurring themes.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
        required: ["name", "description"],
        additionalProperties: false,
      },
    },
    recommendations: {
      type: "array",
      description: "3-5 practical, actionable recommendations.",
      items: { type: "string" },
    },
  },
  required: ["summary", "sentiment", "themes", "recommendations"],
  additionalProperties: false,
} as const;

async function analyzeWithClaude(
  title: string,
  questions: string[],
  answers: string[][]
): Promise<AnalysisResult> {
  const client = new Anthropic();

  const transcript = answers
    .map(
      (response, responseIndex) =>
        `Response ${responseIndex + 1}:\n` +
        questions
          .map(
            (question, questionIndex) =>
              `  Q: ${question}\n  A: ${response[questionIndex] || "(no answer)"}`
          )
          .join("\n")
    )
    .join("\n\n");

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      format: { type: "json_schema", schema: ANALYSIS_SCHEMA },
    },
    system:
      "You analyse survey responses for researchers, lecturers, and quality teams. " +
      "Identify what participants are really saying, recurring themes, and practical next steps. " +
      "Write the analysis in the same language as the survey questions.",
    messages: [
      {
        role: "user",
        content: `Survey title: ${title}\n\nQuestions:\n${questions
          .map((question, index) => `${index + 1}. ${question}`)
          .join("\n")}\n\nResponses:\n${transcript}`,
      },
    ],
  });

  const text = message.content.find((block) => block.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("Empty analysis response");
  }
  return JSON.parse(text.text) as AnalysisResult;
}

/**
 * Offline fallback used when ANTHROPIC_API_KEY is not configured:
 * response volume, answer rates, and the most frequent meaningful words.
 */
function analyzeBasic(
  questions: string[],
  answers: string[][]
): AnalysisResult {
  const allText = answers.flat().join(" ").toLowerCase();
  const words = allText
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 3);

  const frequency = new Map<string, number>();
  for (const word of words) {
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }
  const topWords = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const answerRate =
    answers.length === 0
      ? 0
      : Math.round(
          (answers.flat().filter(Boolean).length /
            (answers.length * questions.length)) *
            100
        );

  return {
    summary:
      `Collected ${answers.length} responses across ${questions.length} questions ` +
      `with an overall answer rate of ${answerRate}%. ` +
      `This is a basic statistical overview — connect an Anthropic API key to unlock full AI analysis.`,
    sentiment: "neutral",
    themes: topWords.map(([word, count]) => ({
      name: word,
      description: `Mentioned ${count} times across responses.`,
    })),
    recommendations: [
      "Review the most frequent terms above for recurring topics.",
      "Collect more responses to strengthen the signal.",
      "Add ANTHROPIC_API_KEY to enable AI summaries, themes, and recommendations.",
    ],
  };
}

export async function runSurveyAnalysis(surveyId: string): Promise<{
  engine: "claude" | "basic";
  result: AnalysisResult;
}> {
  const db = getDb();
  const survey = db
    .prepare("SELECT title, questions FROM surveys WHERE id = ?")
    .get(surveyId) as { title: string; questions: string } | undefined;
  if (!survey) throw new Error("Survey not found");

  const questions = JSON.parse(survey.questions) as string[];
  const answers = (
    db
      .prepare("SELECT answers FROM responses WHERE survey_id = ? ORDER BY id")
      .all(surveyId) as { answers: string }[]
  ).map((row) => JSON.parse(row.answers) as string[]);

  let engine: "claude" | "basic" = "basic";
  let result: AnalysisResult;

  if (process.env.ANTHROPIC_API_KEY) {
    engine = "claude";
    result = await analyzeWithClaude(survey.title, questions, answers);
  } else {
    result = analyzeBasic(questions, answers);
  }

  db.prepare(
    `INSERT INTO analyses (survey_id, engine, result, response_count)
     VALUES (?, ?, ?, ?)`
  ).run(surveyId, engine, JSON.stringify(result), answers.length);

  return { engine, result };
}
