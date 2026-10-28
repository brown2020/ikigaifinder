import { describe, expect, it } from "vitest";
import { formatPersonName, splitPersonName, usablePersonName } from "./personName";

describe("person names", () => {
  it("ignores email addresses and keeps a real name", () => {
    expect(usablePersonName("  Ada Lovelace  ")).toBe("Ada Lovelace");
    expect(usablePersonName("ada@example.com")).toBe("");
    expect(splitPersonName("Ada Lovelace")).toEqual({ firstName: "Ada", lastName: "Lovelace" });
    expect(splitPersonName("ada@example.com")).toEqual({ firstName: "", lastName: "" });
    expect(formatPersonName({ firstName: "ada@example.com", displayName: "Ada Lovelace" })).toBe("Ada Lovelace");
    expect(formatPersonName({ firstName: "Ada", lastName: "Lovelace" })).toBe("Ada Lovelace");
    expect(formatPersonName({ firstName: "", displayName: "ada@example.com" })).toBe("You");
  });
});
