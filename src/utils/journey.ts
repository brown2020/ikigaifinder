import type { Ikigai, QuestionStep } from "@/types";

export const JOURNEY_STEPS = [
  { key: "passion", label: "Love", href: "/ikigai-finder?step=1" },
  { key: "profession", label: "Strengths", href: "/ikigai-finder?step=2" },
  { key: "mission", label: "World", href: "/ikigai-finder?step=3" },
  { key: "vocation", label: "Livelihood", href: "/ikigai-finder?step=4" },
  { key: "ideas", label: "Ideas", href: "/generate-ikigai" },
  { key: "card", label: "Card", href: "/generate-ikigai/card" },
] as const;

/** Shown when a guest finishes answering and needs an account to see ideas. */
export const SIGN_UP_PROMPT = {
  title: "Your answers are ready",
  body: "Create a free account to see the ikigai statements written from them. Your answers come with you.",
};

export type JourneyStepKey = (typeof JOURNEY_STEPS)[number]["key"];

export function isSectionComplete(step: QuestionStep | undefined): boolean {
  return Boolean(step?.questions.every((q) => q.answer?.some((a) => a.trim().length > 0)));
}

export function isSurveyComplete(answers: QuestionStep[]): boolean {
  return answers.length > 0 && answers.every(isSectionComplete);
}

/** 1-based index of the first unanswered section, or null when all are answered. */
export function firstIncompleteSection(answers: QuestionStep[]): number | null {
  const index = answers.findIndex((step) => !isSectionComplete(step));
  return index === -1 ? null : index + 1;
}

export function completedSteps(ikigai: Ikigai): Set<JourneyStepKey> {
  const done = new Set<JourneyStepKey>();
  ikigai.answers.forEach((step) => {
    if (isSectionComplete(step)) done.add(step.id as JourneyStepKey);
  });
  if (ikigai.ikigaiSelected) done.add("ideas");
  if (ikigai.ikigaiCoverImage) done.add("card");
  return done;
}

/** Where a returning user should pick up. */
export function resumeHref(ikigai: Ikigai): string {
  const section = firstIncompleteSection(ikigai.answers);
  if (section) return `/ikigai-finder?step=${section}`;
  if (!ikigai.ikigaiSelected) return "/generate-ikigai";
  return "/generate-ikigai/card";
}
