import { describe, expect, it } from "vitest";
import { rateLimit } from "./rateLimit";
import { sanitizeInput } from "./validation";

describe("sanitizeInput", () => {
  it("strips angle brackets, trims, and caps length before text reaches the model", () => {
    expect(sanitizeInput("  <script>alert(1)</script> teach  ")).toBe("scriptalert(1)/script teach");
    expect(sanitizeInput("x".repeat(20_000))).toHaveLength(10_000);
  });
});

describe("rateLimit", () => {
  it("allows up to the limit per key, then blocks with a reset time, independently per key", () => {
    const key = `test:${Math.random()}`;
    const results = Array.from({ length: 4 }, () => rateLimit(key, { limit: 3, windowMs: 60_000 }));
    expect(results.map((r) => r.success)).toEqual([true, true, true, false]);
    expect(results[3].resetIn).toBeGreaterThan(0);
    expect(rateLimit(`${key}:other`, { limit: 3, windowMs: 60_000 }).success).toBe(true);
  });
});
