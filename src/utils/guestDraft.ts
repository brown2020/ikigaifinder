import type { QuestionStep } from "@/types";

const KEY = "ikigaiFinderGuestAnswers";

/**
 * Answers a signed-out visitor has written, kept on their device until they
 * create an account. Storage can be unavailable (private mode, blocked site
 * data), so every access is best-effort.
 */
export function loadGuestAnswers(): QuestionStep[] | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as QuestionStep[]) : null;
  } catch {
    return null;
  }
}

export function saveGuestAnswers(answers: QuestionStep[]): void {
  try {
    const slim = answers.map((step) => ({
      id: step.id,
      questions: step.questions.map((q) => ({ id: q.id, answer: q.answer ?? [] })),
    }));
    window.localStorage.setItem(KEY, JSON.stringify(slim));
  } catch {
    // Best-effort: answers still live in memory for this visit.
  }
}

export function clearGuestAnswers(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}

export function countAnswered(answers: QuestionStep[]): number {
  return answers.reduce(
    (n, step) => n + step.questions.filter((q) => q.answer?.some((a) => a.trim())).length,
    0
  );
}
