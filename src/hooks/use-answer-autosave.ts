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
 */
export function useAnswerAutosave<T extends FieldValues>(
  watch: UseFormWatch<T>,
  getValues: UseFormGetValues<T>,
  toAnswers: (values: T, stored: QuestionStep[]) => QuestionStep[],
  delay = 1200
): AutosaveState {
  const [state, setState] = useState<AutosaveState>("idle");
  const toAnswersRef = useRef(toAnswers);

  useEffect(() => {
    toAnswersRef.current = toAnswers;
  }, [toAnswers]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = watch(() => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const { ikigaiData, updateIkigai } = useIkigaiStore.getState();
        const answers = toAnswersRef.current(getValues(), ikigaiData.answers);
        if (sameAnswers(answers, ikigaiData.answers)) return;
        setState("saving");
        setState((await updateIkigai({ answers }, { quiet: true })) ? "saved" : "error");
      }, delay);
    });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [watch, getValues, delay]);

  return state;
}
