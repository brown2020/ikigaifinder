"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { IKIGAI_SYSTEMPROMPT } from "../constants/systemPrompt";

type questionsT = {
  question: string;
  answer: string[];
};

export async function generateIkigai(questions: questionsT[]) {
  const systemPrompt = IKIGAI_SYSTEMPROMPT;

  const questionsPrompt = questions
    .map(
      (q) =>
        `Question: ${q.question}\nAnswer: ${
          Array.isArray(q.answer) && q.answer?.length > 0
            ? q.answer.join(", ")
            : null
        }`
    )
    .join("\n\n");
  const userPrompt = `${questionsPrompt}\n\nAnalyze my interests, skills, and aspirations to provide 10 unique ikigai statements that combine what I love, what I'm good at, what the world needs, and what I could be paid for. Include scores out of 100 for Passion, Profession, Mission, and Vocation for each statement.`;

  console.log("User Prompt:", userPrompt);

  const messages: CoreMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
