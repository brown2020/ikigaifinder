import { describe, expect, it } from "vitest";
import { extractIkigaiData, mergeIkigaiLists } from "./ikigaiParser";

const SAMPLE = `1. My Ikigai is to **teach** others
   - Passion & Profession: 80%
   - Profession & Vocation: 70%
   - Vocation & Mission: 60%
   - Passion & Mission: 90%
   - Overall Compatibility: 75%

2. My Ikigai is to build communities
   - Passion & Profession: 50.5%
   - Profession & Vocation: 40%
   - Vocation & Mission: 30%
   - Passion & Mission: 20%
   - Overall Compatibility: 35%`;

describe("extractIkigaiData", () => {
  it("returns an empty array for empty input", () => {
    expect(extractIkigaiData("")).toEqual([]);
  });

  it("returns an empty array when the format does not match", () => {
    expect(extractIkigaiData("just some unstructured text")).toEqual([]);
  });

  it("parses structured ikigai statements with scores", () => {
    const result = extractIkigaiData(SAMPLE);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      ikigai: "My Ikigai is to teach others",
      Passion: 80,
      Profession: 70,
      Vocation: 60,
      Mission: 90,
      OverallCompatibility: 75,
    });
  });

  it("strips markdown bold markers and parses decimals", () => {
    const result = extractIkigaiData(SAMPLE);
    expect(result[0].ikigai).not.toContain("**");
    expect(result[1].Passion).toBe(50.5);
  });

  it("is safe to call repeatedly (global regex lastIndex reset)", () => {
    expect(extractIkigaiData(SAMPLE)).toHaveLength(2);
    expect(extractIkigaiData(SAMPLE)).toHaveLength(2);
  });
});

describe("mergeIkigaiLists", () => {
  it("appends new unique items", () => {
    const current = extractIkigaiData(SAMPLE).slice(0, 1);
    const incoming = extractIkigaiData(SAMPLE);
    const merged = mergeIkigaiLists(current, incoming);
    expect(merged).toHaveLength(2);
  });

  it("deduplicates by normalized statement text", () => {
    const current = extractIkigaiData(SAMPLE);
    const merged = mergeIkigaiLists(current, extractIkigaiData(SAMPLE));
    expect(merged).toHaveLength(2);
  });

  it("treats case/whitespace/punctuation differences as duplicates", () => {
    const current = [
      {
        ikigai: "My Ikigai is to teach others",
        Passion: 1,
        Profession: 1,
        Vocation: 1,
        Mission: 1,
        OverallCompatibility: 1,
      },
    ];
    const incoming = [
      {
        ikigai: "  MY IKIGAI is to teach others!!  ",
        Passion: 2,
        Profession: 2,
        Vocation: 2,
        Mission: 2,
        OverallCompatibility: 2,
      },
    ];
    expect(mergeIkigaiLists(current, incoming)).toHaveLength(1);
  });
});
