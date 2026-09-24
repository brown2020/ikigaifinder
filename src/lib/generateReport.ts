"use server";

import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { IKIGAI_REPORT_PROMPT } from "@/constants/systemPrompt";
import { requireAuth } from "@/lib/auth/session-server";
import { rateLimitAI } from "./rateLimit";
import { generateReportSchema, sanitizeInput } from "./validation";
import type { IkigaiReport } from "@/types";
import type { QuestionSection } from "@/utils/promptUtils";

const AI_MODEL = "gpt-4o";

const circle = z.enum(["love", "skill", "world", "paid"]);
const words = z.array(z.string()).describe("Two or three words or short phrases");

const reportSchema = z.object({
  summary: z.string(),
  circles: z.array(z.object({ circle, insight: z.string(), evidence: z.string() })),
  growthEdge: z.object({ circle, advice: z.string() }),
  firstSteps: z.array(z.object({ title: z.string(), detail: z.string() })),
  paths: z.array(z.object({ title: z.string(), why: z.string() })),
  keywords: z.object({ love: words, skill: words, world: words, paid: words }),
});

type ReportResult = { report: IkigaiReport; error?: never } | { report?: never; error: string };

const clip = (text: string, max: number) => text.trim().slice(0, max);

/** Keeps the model's output within the shapes the UI lays out. */
function tidy(raw: z.infer<typeof reportSchema>, statement: string): IkigaiReport {
  const byCircle = new Map(raw.circles.map((c) => [c.circle, c]));
  return {
    statement,
    summary: clip(raw.summary, 800),
    circles: circle.options.flatMap((id) => {
      const c = byCircle.get(id);
      return c ? [{ circle: id, insight: clip(c.insight, 400), evidence: clip(c.evidence, 200) }] : [];
    }),
    growthEdge: { circle: raw.growthEdge.circle, advice: clip(raw.growthEdge.advice, 400) },
    firstSteps: raw.firstSteps.slice(0, 3).map((s) => ({ title: clip(s.title, 80), detail: clip(s.detail, 240) })),
    paths: raw.paths.slice(0, 5).map((p) => ({ title: clip(p.title, 80), why: clip(p.why, 240) })),
    keywords: Object.fromEntries(
      circle.options.map((id) => [id, raw.keywords[id].slice(0, 3).map((w) => clip(w, 18)).filter(Boolean)])
    ) as IkigaiReport["keywords"],
  };
}

/**
 * Writes a personal report for the statement the signed-in user chose,
 * grounded in their answers. Returns an error message instead of throwing so
 * the client can show it (server action errors are masked in production).
 */
export async function generateIkigaiReport(
  questions: QuestionSection[],
  statement: string
): Promise<ReportResult> {
  let uid: string;
  try {
    ({ uid } = await requireAuth());
  } catch {
    return { error: "You must be signed in to see your report." };
  }

  const rateLimit = rateLimitAI(uid);
  if (!rateLimit.success) {
    return { error: `You're moving quickly. Try again in ${Math.ceil(rateLimit.resetIn / 1000)} seconds.` };
  }

  const parsed = generateReportSchema.safeParse({ questions, statement });
  if (!parsed.success) {
    return { error: "Your answers couldn't be read. Please review them and try again." };
  }

  const sections = parsed.data.questions.map((section) => ({
    circle: section.id,
    answers: section.questions.map((q) => ({
      question: q.question,
      answer: q.answer.map(sanitizeInput).join(", "),
    })),
  }));
  const chosen = sanitizeInput(parsed.data.statement);

  try {
    const { output } = await generateText({
      model: openai(AI_MODEL),
      system: IKIGAI_REPORT_PROMPT,
      prompt: `Questionnaire answers:\n${JSON.stringify(sections, null, 2)}\n\nChosen statement: ${chosen}`,
      temperature: 0.6,
      output: Output.object({ schema: reportSchema, name: "ikigai_report" }),
    });
    return { report: tidy(output, parsed.data.statement) };
  } catch (error) {
    console.error("Ikigai report generation failed:", error);
    return { error: "We couldn't write your report just now. Please try again." };
  }
}
