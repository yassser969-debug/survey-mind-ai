import { NextResponse } from "next/server";
import { getSurvey } from "@/lib/surveys";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = getSurvey(id);

  if (!result) return NextResponse.json({ error: "Survey not found." }, { status: 404 });

  return NextResponse.json(result);
}
