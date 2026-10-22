"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormGetValues, UseFormWatch } from "react-hook-form";
import { useIkigaiStore } from "@/zustand";
import type { QuestionStep } from "@/types";

export type AutosaveState = "idle" | "saving" | "saved" | "error";

const flatten = (steps: QuestionStep[]) =>
  JSON.stringify(steps.flatMap((s) => s.questions.map((q) => [q.id, q.answer ?? []])));

export function sameAnswers(a: QuestionStep[], b: QuestionStep[]): boolean {
  return flatten(a) === flatten(b);
}

/**
 * Saves answers shortly after the person stops typing, so a refresh or a
 * closed tab loses nothing. `toAnswers` maps form values onto the stored steps.
 * Tracks what this form last saw (`base`) so saves only apply its own edits.
 */
export function useAnswerAutosave<T extends FieldValues>(
  watch: UseFormWatch<T>,
  getValues: UseFormGetValues<T>,
  toAnswers: (values: T, stored: QuestionStep[]) => QuestionStep[],
  delay = 1200
): { state: AutosaveState; base: () => QuestionStep[] } {
  const [state, setState] = useState<AutosaveState>("idle");
  const toAnswersRef = useRef(toAnswers);
  const baseRef = useRef<QuestionStep[] | null>(null);

  useEffect(() => {
    toAnswersRef.current = toAnswers;
  }, [toAnswers]);

  useEffect(() => {
    baseRef.current = toAnswersRef.current(getValues(), useIkigaiStore.getState().ikigaiData.answers);
  }, [getValues]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = watch(() => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const { ikigaiData, updateIkigai } = useIkigaiStore.getState();
        const answers = toAnswersRef.current(getValues(), ikigaiData.answers);
        const base = baseRef.current ?? ikigaiData.answers;
        if (sameAnswers(answers, base)) return;
        setState("saving");
        const ok = await updateIkigai({ answers }, { quiet: true, base });
        if (ok) baseRef.current = answers;
        setState(ok ? "saved" : "error");
      }, delay);
    });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [watch, getValues, delay]);

  return { state, base: () => baseRef.current ?? useIkigaiStore.getState().ikigaiData.answers };
}
