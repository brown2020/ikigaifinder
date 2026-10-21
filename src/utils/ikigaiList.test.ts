import { describe, expect, it } from "vitest";
import { displayStatement, isSameStatement, mergeIkigaiLists } from "./ikigaiList";
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
