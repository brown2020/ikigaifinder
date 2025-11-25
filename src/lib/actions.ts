"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { IKIGAI_SYSTEMPROMPT } from "@/constants/systemPrompt";
import type { SurveyQuestion } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface GenerateMessage {
  role: "system" | "user";
  content: string;
}

// ============================================================================
// Constants
// ============================================================================

const AI_MODEL = "gpt-4.1";
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
  const questionsPrompt = questions
    .map((q) => `Question: ${q.question}\nAnswer: ${q.answer.join("; ")}`)
    .join("\n\n");

  const userPrompt = `${questionsPrompt}\n\nBased on the above answers, return ${NUM_SUGGESTIONS} suggested purpose statements each followed by exactly one newline character.`;

  // Prepare messages for the AI
  const messages: GenerateMessage[] = [
    { role: "system", content: IKIGAI_SYSTEMPROMPT },
    { role: "user", content: userPrompt },
  ];

  // Stream the response
  const result = streamText({
    model: openai(AI_MODEL),
    messages,
    temperature: 0.7,
  });

  // Return a streamable value for real-time updates
  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
