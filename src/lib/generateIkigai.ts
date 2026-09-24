"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { Output, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { IKIGAI_SYSTEM_PROMPT } from "@/constants/systemPrompt";
import { requireAuth } from "@/lib/auth/session-server";
import { rateLimitAI } from "./rateLimit";
import { generateIkigaiSchema, sanitizeInput } from "./validation";
import type { IkigaiData } from "@/types";
import type { QuestionSection } from "@/utils/promptUtils";

const AI_MODEL = "gpt-4o";
const STATEMENTS_PER_RUN = 5;

const score = z.number().int().min(0).max(100);
const statementSchema = z.object({
  statement: z.string().describe('One sentence starting with "My ikigai is to"'),
  passion: score,
  mission: score,
  vocation: score,
  profession: score,
  overall: score,
});

function toIkigaiData(s: z.infer<typeof statementSchema>): IkigaiData {
  return {
    ikigai: s.statement.trim().replace(/^my ikigai is to\s*/i, "My ikigai is to "),
    Passion: s.passion,
    Mission: s.mission,
    Vocation: s.vocation,
    Profession: s.profession,
    OverallCompatibility: s.overall,
  };
}

/**
 * Streams ikigai statements for the signed-in user's answers. The streamable
 * value is the cumulative list of completed statements, so the client can
 * render each one as soon as it is fully generated.
 *
 * @param questions  Answers grouped by questionnaire section.
 * @param guidance   Optional free-text steer from the user.
 * @param existing   Statements already shown, so new ones don't repeat them.
 */
export async function generateIkigai(
  questions: QuestionSection[],
  guidance = "",
  existing: string[] = []
) {
  let uid: string;
  try {
    ({ uid } = await requireAuth());
  } catch {
    throw new Error("You must be signed in to generate ikigai statements.");
  }

  const rateLimit = rateLimitAI(uid);
  if (!rateLimit.success) {
    throw new Error(
      `You're generating quickly. Try again in ${Math.ceil(rateLimit.resetIn / 1000)} seconds.`
    );
  }

  const parsed = generateIkigaiSchema.safeParse({ questions, customPrompt: guidance, existing });
  if (!parsed.success) {
    throw new Error("Your answers couldn't be read. Please review them and try again.");
  }

  const sections = parsed.data.questions.map((section) => ({
    circle: section.id,
    answers: section.questions.map((q) => ({
      question: q.question,
      answer: q.answer.map(sanitizeInput).join(", "),
    })),
  }));
  const cleanGuidance = sanitizeInput(parsed.data.customPrompt);
  const avoid = parsed.data.existing.map(sanitizeInput);

  const prompt = [
    `Questionnaire answers:\n${JSON.stringify(sections, null, 2)}`,
    cleanGuidance && `Guidance from the person, follow it closely: ${cleanGuidance}`,
    avoid.length > 0 &&
      `They have already seen these statements. Write new ones that take different angles:\n${avoid.map((s) => `- ${s}`).join("\n")}`,
    `Write ${STATEMENTS_PER_RUN} ikigai statements.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const stream = createStreamableValue<IkigaiData[]>([]);

  (async () => {
    try {
      const result = streamText({
        model: openai(AI_MODEL),
        system: IKIGAI_SYSTEM_PROMPT,
        prompt,
        temperature: 0.8,
        output: Output.array({ element: statementSchema, name: "ikigai_statements" }),
      });

      const collected: IkigaiData[] = [];
      for await (const element of result.elementStream) {
        collected.push(toIkigaiData(element));
        stream.update([...collected]);
      }
      if (collected.length === 0) {
        throw new Error("No statements were generated");
      }
      stream.done();
    } catch (error) {
      console.error("Ikigai generation failed:", error);
      stream.error(new Error("We couldn't generate ideas just now. Please try again."));
    }
  })();

  return stream.value;
}
