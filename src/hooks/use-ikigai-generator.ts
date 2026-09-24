"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import { generateIkigai } from "@/lib/generateIkigai";
import { mergeIkigaiLists } from "@/utils/ikigaiList";
import type { IkigaiData, QuestionStep } from "@/types";

interface GenerateArgs {
  answers: QuestionStep[];
  current: IkigaiData[];
  guidance?: string;
}

interface UseIkigaiGeneratorReturn {
  /** Streams new statements, merged after `current`. Resolves to the final list, or null on failure. */
  generate: (args: GenerateArgs) => Promise<IkigaiData[] | null>;
  isGenerating: boolean;
  error: string | null;
  clearError: () => void;
}

function toQuestionSections(steps: QuestionStep[]) {
  // Quick-path users leave most questions blank; only send what they wrote.
  return steps.map((step) => ({
    id: step.id,
    questions: step.questions
      .map((q) => ({ question: q.label, answer: (q.answer ?? []).filter((a) => a.trim()) }))
      .filter((q) => q.answer.length > 0),
  }));
}

export function useIkigaiGenerator(
  onUpdate: (list: IkigaiData[]) => void
): UseIkigaiGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runRef = useRef(0);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => () => {
    runRef.current += 1;
  }, []);

  const generate = useCallback(async ({ answers, current, guidance = "" }: GenerateArgs) => {
    const run = ++runRef.current;
    setIsGenerating(true);
    setError(null);
    let latest = current;

    try {
      const stream = await generateIkigai(
        toQuestionSections(answers),
        guidance,
        current.map((item) => item.ikigai)
      );
      for await (const batch of readStreamableValue(stream)) {
        if (run !== runRef.current) return null;
        if (!batch?.length) continue;
        latest = mergeIkigaiLists(current, batch);
        onUpdateRef.current(latest);
      }
      return latest;
    } catch (err) {
      if (run !== runRef.current) return null;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return latest.length > current.length ? latest : null;
    } finally {
      if (run === runRef.current) setIsGenerating(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { generate, isGenerating, error, clearError };
}
