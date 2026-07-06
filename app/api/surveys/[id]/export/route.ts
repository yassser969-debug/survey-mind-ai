import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getResponses, getSurvey } from "@/lib/surveys";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const result = getSurvey(id);
  if (!result || result.survey.userId !== user.id) {
    return NextResponse.json({ error: "Survey not found." }, { status: 404 });
  }

  const responses = getResponses(id);
  const header = ["Submitted at", ...result.questions.map((q) => q.text)];

  const rows = responses.map((response) => {
    const answerByQuestion = new Map(response.answers.map((a) => [a.questionId, a.value]));
    return [response.createdAt, ...result.questions.map((q) => answerByQuestion.get(q.id) ?? "")];
  });

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${result.survey.title.replace(/[^a-z0-9]+/gi, "-")}-responses.csv"`,
    },
  });
}
