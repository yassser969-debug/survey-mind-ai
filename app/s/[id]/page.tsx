import SurveyRunner from "./survey-runner";

const surveys: Record<
  string,
  {
    title: string;
    description: string;
    questions: { text: string; type: "short" | "long" | "choice" | "rating"; options?: string[] }[];
  }
> = {
  "quality-feedback-review": {
    title: "Quality Feedback Review",
    description: "Help us understand how clear and useful our feedback process has been for you.",
    questions: [
      { text: "How clear were the assessment criteria?", type: "rating" },
      {
        text: "Which area needs the most improvement?",
        type: "choice",
        options: ["Clarity", "Speed of feedback", "Learning support", "Communication"],
      },
      { text: "What would make the feedback process better for you?", type: "long" },
    ],
  },
  "course-experience-survey": {
    title: "Course Experience Survey",
    description: "A quick survey about your experience in this course.",
    questions: [
      { text: "Your name (optional)", type: "short" },
      { text: "How would you rate the course overall?", type: "rating" },
      { text: "What did you enjoy most?", type: "long" },
    ],
  },
};

export default async function TakeSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const survey = surveys[id] ?? {
    title: "Sample Survey",
    description: "This survey preview uses sample questions.",
    questions: [
      { text: "How satisfied are you overall?", type: "rating" as const },
      { text: "What could we do better?", type: "long" as const },
    ],
  };

  return <SurveyRunner survey={survey} />;
}
