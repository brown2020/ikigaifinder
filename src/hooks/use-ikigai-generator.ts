"use client";

import { useState, useRef, useCallback } from "react";
import { generateIkigai } from "@/lib/generateIkigai";
import { readStreamableValue } from "@ai-sdk/rsc";
import { extractIkigaiData, mergeIkigaiLists } from "@/utils/ikigaiParser";
import type { IkigaiData, QuestionStep } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface UseIkigaiGeneratorOptions {
  /** Current ikigai data list */
  ikigaiData: IkigaiData[];
  /** Callback to update ikigai data */
  onDataUpdate: (data: IkigaiData[]) => void;
  /** Additional guidance for the AI */
  guidance?: string;
  /** Minimum results before stopping loading indicator */
  minResultsForEarlyComplete?: number;
}

interface UseIkigaiGeneratorReturn {
  /** Generate ikigai suggestions from answers */
  generate: (answers: QuestionStep[]) => Promise<void>;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Ref to scroll to when results appear */
  resultEndRef: React.RefObject<HTMLDivElement | null>;
  /** Any error that occurred during generation */
  error: Error | null;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MIN_RESULTS = 5;

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for generating Ikigai suggestions using AI
 * 
 * Handles:
 * - Streaming AI responses
 * - Parsing ikigai data from responses
 * - Merging new results with existing data
 * - Auto-scrolling to new results
 */
export function useIkigaiGenerator({
  ikigaiData,
  onDataUpdate,
  guidance = "",
  minResultsForEarlyComplete = DEFAULT_MIN_RESULTS,
}: UseIkigaiGeneratorOptions): UseIkigaiGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const resultEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * Transform question step data into AI-friendly format
   */
  const prepareQuestionData = useCallback((steps: QuestionStep[]) => {
    return steps.map((step) => ({
      id: step.id,
      questions: step.questions.map((q) => ({
        question: q.label,
        answer: q.answer ?? [],
      })),
    }));
  }, []);

  /**
   * Scroll to the end of results
   */
  const scrollToResults = useCallback(() => {
    resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /**
   * Generate ikigai suggestions from survey answers
   */
  const generate = useCallback(async (answers: QuestionStep[]): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      const questionData = prepareQuestionData(answers);

      const customPrompt = guidance
        ? `Incorporate the following additional guidance in shaping your response: ${guidance}`
        : "";

      const result = await generateIkigai(questionData, customPrompt);

      for await (const content of readStreamableValue(result)) {
        if (!content) continue;

        const parsedList = extractIkigaiData(content);

        // Stop loading indicator early if we have enough results
        if (parsedList.length >= minResultsForEarlyComplete) {
          setIsGenerating(false);
        }

        const mergedData = mergeIkigaiLists(ikigaiData, parsedList);
        onDataUpdate(mergedData);
        scrollToResults();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to generate Ikigai");
      setError(error);
      console.error("Error generating Ikigai:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [ikigaiData, onDataUpdate, guidance, minResultsForEarlyComplete, prepareQuestionData, scrollToResults]);

  return {
    generate,
    isGenerating,
    resultEndRef,
    error,
  };
}

// Legacy export for backward compatibility
export { useIkigaiGenerator as default };

