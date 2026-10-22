import { describe, expect, it } from "vitest";
import { generateIkigaiSchema } from "@/lib/validation";
import { AVOID_LIST_LIMIT, displayStatement, isSameStatement, mergeIkigaiLists, recentStatements, shownStatement } from "./ikigaiList";
import type { IkigaiData } from "@/types";

const make = (ikigai: string, n = 50): IkigaiData => ({
  ikigai,
  Passion: n,
  Profession: n,
  Vocation: n,
  Mission: n,
  OverallCompatibility: n,
});

describe("mergeIkigaiLists", () => {
  it("puts new unique items first, in the order they arrived", () => {
    const merged = mergeIkigaiLists(
      [make("My ikigai is to teach")],
      [make("My ikigai is to build"), make("My ikigai is to coach")]
    );
    expect(merged.map((m) => m.ikigai)).toEqual([
      "My ikigai is to build",
      "My ikigai is to coach",
      "My ikigai is to teach",
    ]);
  });

  it("keeps the existing copy when a duplicate arrives", () => {
    const merged = mergeIkigaiLists([make("My ikigai is to teach", 1)], [make("  MY IKIGAI is to **teach**!! ", 2)]);
    expect(merged).toHaveLength(1);
    expect(merged[0].Passion).toBe(1);
  });

  it("deduplicates within the incoming list", () => {
    expect(mergeIkigaiLists([], [make("A plan"), make("a plan.")])).toHaveLength(1);
  });

  it("ignores empty statements", () => {
    expect(mergeIkigaiLists([], [make("  ")])).toHaveLength(0);
  });
});

describe("recentStatements", () => {
  const many = Array.from({ length: 65 }, (_, i) => make(`My ikigai is to teach group ${i}`));

  it("keeps only the newest statements", () => {
    const recent = recentStatements(many);
    expect(recent).toHaveLength(AVOID_LIST_LIMIT);
    expect(recent[0]).toBe("My ikigai is to teach group 0");
  });

  it("stays within the server's existing-statements limit after many batches", () => {
    const questions = [{ id: "love", questions: [{ question: "What do you love?", answer: ["Teaching"] }] }];
    const parsed = generateIkigaiSchema.safeParse({ questions, customPrompt: "", existing: recentStatements(many) });
    expect(parsed.success).toBe(true);
  });
});

describe("isSameStatement", () => {
  it("compares normalized text and handles null", () => {
    expect(isSameStatement(make("Hello, world"), make("hello world"))).toBe(true);
    expect(isSameStatement(null, make("x"))).toBe(false);
  });
});

describe("displayStatement", () => {
  it("strips legacy markdown markers", () => {
    expect(displayStatement("My ikigai is to **teach** ")).toBe("My ikigai is to teach");
  });
});

describe("shownStatement", () => {
  it("shows the statement baked into the card, not a newer choice", () => {
    expect(shownStatement("https://img/card.png", "My ikigai is to teach", "My ikigai is to build")).toBe("My ikigai is to teach");
  });

  it("falls back to the current choice for legacy cards and when there is no card", () => {
    expect(shownStatement("https://img/card.png", undefined, "My ikigai is to build")).toBe("My ikigai is to build");
    expect(shownStatement(null, "My ikigai is to teach", "My ikigai is to build")).toBe("My ikigai is to build");
    expect(shownStatement(null, undefined, null)).toBeNull();
  });
});
