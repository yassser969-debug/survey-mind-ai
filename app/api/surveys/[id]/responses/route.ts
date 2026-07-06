import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addResponse, getResponses, getSurvey } from "@/lib/surveys";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getSurvey(id)) return NextResponse.json({ error: "Survey not found." }, { status: 404 });

  const { answers } = await request.json();
  const responseId = addResponse(id, answers ?? {});

  return NextResponse.json({ id: responseId });
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const result = getSurvey(id);
  if (!result || result.survey.userId !== user.id) {
    return NextResponse.json({ error: "Survey not found." }, { status: 404 });
  }

  return NextResponse.json({ responses: getResponses(id), questions: result.questions });
}
