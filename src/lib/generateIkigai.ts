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

export async function generateIkigai(questions: questionsT[]) {
  const systemPrompt = IKIGAI_SYSTEMPROMPT2;
  const defaultClientPrompt = `Analyze the provided data about my interests, skills, aspirations, and potential career paths. Generate 10 unique ikigai statements that combine what I love, what I'm good at, what the world needs, and what I could be paid for, presenting each as a complete sentence without labels.
For each ikigai statement, calculate and provide the percentage match between: passion & profession, profession & vocation, vocation & mission, passion & mission and Overall compatibility. Present these percentages on separate lines.`;

  // old prompt
  // `Analyze my interests, skills, and aspirations to provide 10 unique ikigai statements that combine what I love, what I'm good at, what the world needs, and what I could be paid for. Include scores out of 100 for Passion, Profession, Mission, and Vocation for each statement.`
  const userPrompt = `${JSON.stringify(questions)}\n\n\n${defaultClientPrompt}`;

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
