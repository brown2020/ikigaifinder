import { describe, expect, it } from "vitest";
import { contentSecurityPolicy } from "./contentSecurityPolicy";

describe("contentSecurityPolicy", () => {
  it("requires a nonce and keeps eval out of production", () => {
    const csp = contentSecurityPolicy("abc123nonce", false);
    expect(csp).toContain("'nonce-abc123nonce'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    expect(contentSecurityPolicy("abc123nonce", true)).toContain("'unsafe-eval'");
  });
});
