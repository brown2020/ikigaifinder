import { describe, expect, it } from "vitest";
import { shouldClearSessionAfterRefreshError } from "./session-refresh";

describe("shouldClearSessionAfterRefreshError", () => {
  it("clears the cookie only when the token was rejected", () => {
    expect(shouldClearSessionAfterRefreshError(new Error("network down"))).toBe(false);
    expect(shouldClearSessionAfterRefreshError(new Error("Failed to create session (500)"))).toBe(false);
    expect(shouldClearSessionAfterRefreshError(new Error("Failed to create session (401)"))).toBe(true);
    expect(shouldClearSessionAfterRefreshError(new Error("Failed to create session (403)"))).toBe(true);
    expect(shouldClearSessionAfterRefreshError(Object.assign(new Error("revoked"), { code: "auth/id-token-revoked" }))).toBe(true);
    expect(shouldClearSessionAfterRefreshError(Object.assign(new Error("down"), { code: "auth/network-request-failed" }))).toBe(false);
  });
});
