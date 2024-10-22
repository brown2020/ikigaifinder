"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { IKIGAI_SYSTEMPROMPT2 } from "../constants/systemPrompt";

type questionsAnswersT = {
  question: string;
  answer: string[];
};

type questionsT = {
  id: string;
  questions: questionsAnswersT[];
};

export async function generateIkigai(
  questions: questionsT[],
  customPrompt = ""
) {
  const systemPrompt = IKIGAI_SYSTEMPROMPT2;
  const defaultClientPrompt = `${customPrompt}\n\nAnalyze the provided data about my interests, skills, aspirations, and potential career paths. Generate 5 unique ikigai statements that combine what I love, what I'm good at, what the world needs, and what I could be paid for, presenting each as a complete sentence without labels.
  
  For each ikigai statement, calculate and provide the percentage match between: passion & profession, profession & vocation, vocation & mission, passion & mission and Overall compatibility. Present these percentages on separate lines.`;
  const userPrompt = `${JSON.stringify(questions)}\n\n\n${defaultClientPrompt}`;

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
