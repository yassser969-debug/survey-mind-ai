import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createSurvey, listSurveysForUser } from "@/lib/surveys";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  return NextResponse.json({ surveys: listSurveysForUser(user.id) });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { title, description, questions } = await request.json();

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json(
      { error: "A survey needs a title and at least one question." },
      { status: 400 },
    );
  }

  const id = createSurvey(user.id, title, description ?? "", questions);
  return NextResponse.json({ id });
}
