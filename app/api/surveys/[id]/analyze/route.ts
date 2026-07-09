import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSession } from "@/lib/auth";
import { getResponses, getSurvey } from "@/lib/surveys";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const result = await getSurvey(id);
  if (!result || result.survey.userId !== user.id) {
    return NextResponse.json({ error: "Survey not found." }, { status: 404 });
  }

  const responses = await getResponses(id);
  if (responses.length === 0) {
    return NextResponse.json({ error: "This survey has no responses yet." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI analysis isn't configured yet. Set an ANTHROPIC_API_KEY environment variable on this deployment to enable it.",
      },
      { status: 503 },
    );
  }

  const questionById = new Map(result.questions.map((q) => [q.id, q.text]));

  const transcript = responses
    .map((response, index) => {
      const lines = response.answers.map((answer) => {
        const question = questionById.get(answer.questionId) ?? "Unknown question";
        return `  Q: ${question}\n  A: ${answer.value}`;
      });
      return `Response ${index + 1}:\n${lines.join("\n")}`;
    })
    .join("\n\n");

  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system:
      "You are an analyst summarizing survey responses for the person who created the survey. Identify key themes, notable patterns, and concrete suggestions. Be concise and concrete — use short paragraphs or bullet points, no filler.",
    messages: [
      {
        role: "user",
        content: `Survey: ${result.survey.title}\n${result.survey.description}\n\n${transcript}\n\nSummarize the responses above: key themes, sentiment, and concrete recommendations.`,
      },
    ],
  });

  const summary = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return NextResponse.json({ summary, responseCount: responses.length });
}
