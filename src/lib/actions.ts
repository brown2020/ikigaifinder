"use server";

import { IKIGAI_SYSTEMPROMPT } from "@/constants/systemPrompt";
import { createAIStream, formatQuestionsPrompt } from "./ai/stream";
import type { SurveyQuestion } from "@/types";

// ============================================================================
// Constants
// ============================================================================

const NUM_SUGGESTIONS = 10;

// ============================================================================
// Server Action
// ============================================================================

/**
 * Generate purpose statements using AI
 *
 * Analyzes user's survey responses and generates personalized
 * purpose/Ikigai statement suggestions.
 *
 * @param questions - Array of survey questions with answers
 * @returns Streamable value for real-time response updates
 */
export async function generatePurpose(questions: SurveyQuestion[]) {
  // Format questions and answers for the AI
  const questionsPrompt = formatQuestionsPrompt(
    questions.map((q) => ({ question: q.question, answer: q.answer }))
  );

  const userPrompt = `${questionsPrompt}\n\nBased on the above answers, return ${NUM_SUGGESTIONS} suggested purpose statements each followed by exactly one newline character.`;

  // Stream the response using shared utility
  return createAIStream(IKIGAI_SYSTEMPROMPT, userPrompt, {
    model: "gpt-4.1",
  });
}
