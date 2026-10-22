import { describe, expect, it } from "vitest";
import { mergeAnswerEdits } from "./answers";
import type { QuestionStep } from "@/types";

const steps = (a: string[], b: string[]): QuestionStep[] =>
  [{ id: "passion", title: "", description: "", questions: [
    { id: "q1", label: "", type: "text", answer: a },
    { id: "q2", label: "", type: "text", answer: b },
  ] }] as unknown as QuestionStep[];
const answers = (s: QuestionStep[]) => s[0].questions.map((q) => q.answer);

describe("mergeAnswerEdits", () => {
  it("keeps another tab's edit to a different question", () => {
    const base = steps([], []);
    const tabB = steps([], ["B wrote this"]);
    const latest = steps(["A wrote this"], []);
    expect(answers(mergeAnswerEdits(base, tabB, latest))).toEqual([["A wrote this"], ["B wrote this"]]);
  });

  it("lets this tab's edit win on the question it changed", () => {
    expect(answers(mergeAnswerEdits(steps(["old"], []), steps(["mine"], []), steps(["theirs"], [])))).toEqual([["mine"], []]);
  });

  it("does not resurrect a stale value this tab never touched", () => {
    expect(answers(mergeAnswerEdits(steps(["x"], ["y"]), steps(["x"], ["y"]), steps(["x2"], ["y2"])))).toEqual([["x2"], ["y2"]]);
  });

  it("treats clearing an answer as an edit", () => {
    expect(answers(mergeAnswerEdits(steps(["x"], []), steps([], []), steps(["x"], ["other"])))).toEqual([[], ["other"]]);
  });
});
