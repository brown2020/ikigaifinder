import type { QuestionStep } from "@/types";

export interface QuestionSection {
  id: string;
  questions: { question: string; answer: string[] }[];
}

/** Shapes answers for the AI server actions. Quick-path users leave most questions blank; only send what they wrote. */
export function toQuestionSections(steps: QuestionStep[]): QuestionSection[] {
  return steps.map((step) => ({
    id: step.id,
    questions: step.questions
      .map((q) => ({ question: q.label, answer: (q.answer ?? []).filter((a) => a.trim()) }))
      .filter((q) => q.answer.length > 0),
  }));
}

/** Builds the background-image prompt for a card. The statement is used when no scene is described. */
export function buildCoverPrompt({
  scene,
  style,
  statement,
}: {
  scene?: string;
  style?: string;
  statement?: string;
}): string {
  const parts = [
    scene?.trim() ||
      `A symbolic, uplifting scene that evokes this life purpose: "${statement?.trim() || "a meaningful life"}". Show a place, objects, or people in action rather than words.`,
    style && `Rendered in the style of ${style}.`,
    "Beautiful, calm composition with space for overlaid text. No text, letters, or logos.",
  ];
  return parts.filter(Boolean).join("\n\n");
}
