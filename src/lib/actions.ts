"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { QuestionType } from "../types/question";
import { IKIGAI_SYSTEMPROMPT } from "../constants/systemPrompt";

export async function generatePurpose(questions: QuestionType[]) {
  const systemPrompt = IKIGAI_SYSTEMPROMPT;

  const questionsPrompt = questions
    .map((q) => `Question: ${q.question}\nAnswer: ${q.answer.join("; ")}`)
    .join("\n\n");
  const userPrompt = `${questionsPrompt}\n\nBased on the above answers, return 10 suggested purpose statements each followed by exactly one newline character.`;
  const messages: CoreMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
