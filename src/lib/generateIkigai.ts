"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { IKIGAI_SYSTEMPROMPT2 } from "@/constants/systemPrompt";
import { rateLimitAI } from "./rateLimit";
import { generateIkigaiSchema, sanitizeInput } from "./validation";

// ============================================================================
// Types
// ============================================================================

interface QuestionAnswer {
  question: string;
  answer: string[];
}

interface QuestionSection {
  id: string;
  questions: QuestionAnswer[];
}

interface GenerateMessage {
  role: "system" | "user";
  content: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_CLIENT_PROMPT = `Analyze the provided data about my interests, skills, aspirations, and potential career paths. Generate 5 unique ikigai statements that combine what I love, what I'm good at, what the world needs, and what I could be paid for, presenting each as a complete sentence without labels.

For each ikigai statement, calculate and provide the percentage match between: passion & profession, profession & vocation, vocation & mission, passion & mission and Overall compatibility. Present these percentages on separate lines.`;

const AI_MODEL = "gpt-4o";

// ============================================================================
// Server Action
// ============================================================================

/**
 * Generate Ikigai suggestions using AI
 *
 * Uses OpenAI's GPT-4o to analyze user's survey responses and
 * generate personalized Ikigai statements with compatibility scores.
 *
 * @param questions - Array of question sections with answers
 * @param customPrompt - Optional additional guidance for the AI
 * @param userId - User ID for rate limiting (optional, falls back to anonymous)
 * @returns Streamable value for real-time response updates
 * @throws Error with specific message if rate limit is exceeded or validation fails
 */
export async function generateIkigai(
  questions: QuestionSection[],
  customPrompt = "",
  userId = "anonymous"
) {
  // Rate limiting check
  const rateLimitResult = rateLimitAI(userId);
  if (!rateLimitResult.success) {
    throw new Error(
      `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds.`
    );
  }

  // Validate and sanitize input
  const validationResult = generateIkigaiSchema.safeParse({
    questions,
    customPrompt,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Invalid input: ${errors}`);
  }

  // Sanitize the custom prompt
  const sanitizedPrompt = customPrompt ? sanitizeInput(customPrompt) : "";

  // Build the user prompt
  const guidanceSection = sanitizedPrompt ? `${sanitizedPrompt}\n\n` : "";
  const questionsJson = JSON.stringify(questions, null, 2);
  const userPrompt = `${questionsJson}\n\n${guidanceSection}${DEFAULT_CLIENT_PROMPT}`;

  // Prepare messages for the AI
  const messages: GenerateMessage[] = [
    { role: "system", content: IKIGAI_SYSTEMPROMPT2 },
    { role: "user", content: userPrompt },
  ];

  // Stream the response
  const result = streamText({
    model: openai(AI_MODEL),
    messages,
    temperature: 0.7, // Add some creativity while maintaining coherence
  });

  // Return a streamable value for real-time updates
  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
