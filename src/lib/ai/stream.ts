"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// ============================================================================
// Types
// ============================================================================

interface StreamOptions {
  /** Temperature for response creativity (0-1) */
  temperature?: number;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Model to use */
  model?: string;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MODEL = "gpt-4o";
const DEFAULT_TEMPERATURE = 0.7;

// ============================================================================
// Streaming Utilities
// ============================================================================

/**
 * Create a streaming AI response
 *
 * Provides a unified interface for streaming text from OpenAI models.
 * Returns a streamable value that can be consumed by the client.
 *
 * @param systemPrompt - The system prompt to set AI behavior
 * @param userPrompt - The user's input prompt
 * @param options - Additional streaming options
 * @returns Streamable value for real-time response updates
 *
 * @example
 * const stream = await createAIStream(
 *   "You are a helpful assistant.",
 *   "What is the meaning of life?"
 * );
 *
 * for await (const chunk of readStreamableValue(stream)) {
 *   console.log(chunk);
 * }
 */
export async function createAIStream(
  systemPrompt: string,
  userPrompt: string,
  options: StreamOptions = {}
) {
  const { temperature = DEFAULT_TEMPERATURE, model = DEFAULT_MODEL } = options;

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const result = streamText({
    model: openai(model),
    messages,
    temperature,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

/**
 * Create a streaming AI response with custom messages
 *
 * For more complex conversations with multiple messages.
 *
 * @param messages - Array of messages for the conversation
 * @param options - Additional streaming options
 * @returns Streamable value for real-time response updates
 */
export async function createAIStreamWithMessages(
  messages: Message[],
  options: StreamOptions = {}
) {
  const { temperature = DEFAULT_TEMPERATURE, model = DEFAULT_MODEL } = options;

  const result = streamText({
    model: openai(model),
    messages,
    temperature,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

/**
 * Format questions and answers into a prompt string
 *
 * Utility for converting structured survey data into AI-friendly format.
 *
 * @param questions - Array of question/answer pairs
 * @returns Formatted prompt string
 */
export function formatQuestionsPrompt(
  questions: Array<{ question: string; answer: string[] }>
): string {
  return questions
    .map((q) => `Question: ${q.question}\nAnswer: ${q.answer.join("; ")}`)
    .join("\n\n");
}
