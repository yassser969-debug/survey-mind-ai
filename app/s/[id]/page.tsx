import { getSurvey } from "@/lib/surveys";
import SurveyRunner from "./survey-runner";

export default async function TakeSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = getSurvey(id);

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050712] px-4 text-center text-white">
        <div>
          <h1 className="text-2xl font-black">Survey not found</h1>
          <p className="mt-2 text-slate-400">This survey may have been removed or the link is incorrect.</p>
        </div>
      </main>
    );
  }

  // Only pass the fields the respondent-facing client component needs —
  // the full DB row includes userId, which must not reach the browser.
  const survey = { title: result.survey.title, description: result.survey.description };

  return <SurveyRunner surveyId={id} survey={survey} questions={result.questions} />;
}
