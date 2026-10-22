import type { QuestionStep } from "@/types";

const answerKey = (answer: string[] | undefined) => JSON.stringify(answer ?? []);

/**
 * Applies only the questions this form changed (edited vs. the base it last saw) onto the
 * latest saved answers, so edits made meanwhile in another tab or device are kept.
 */
export function mergeAnswerEdits(base: QuestionStep[], edited: QuestionStep[], latest: QuestionStep[]): QuestionStep[] {
  const baseById = new Map(base.flatMap((s) => s.questions.map((q) => [String(q.id), answerKey(q.answer)])));
  const changed = new Map(
    edited.flatMap((s) =>
      s.questions
        .filter((q) => answerKey(q.answer) !== baseById.get(String(q.id)))
        .map((q) => [String(q.id), q.answer ?? []] as const)
    )
  );
  return latest.map((step) => ({
    ...step,
    questions: step.questions.map((q) => (changed.has(String(q.id)) ? { ...q, answer: changed.get(String(q.id)) } : q)),
  }));
}
