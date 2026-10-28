import { describe, expect, it } from "vitest";
import { safeInternalPath, sanitizeRedirect } from "./auth-page-utils";

describe("safeInternalPath", () => {
  it("keeps same-site paths and drops anything that leaves the site", () => {
    expect(safeInternalPath("/dashboard")).toBe("/dashboard");
    expect(safeInternalPath("/ikigai-finder?step=1")).toBe("/ikigai-finder?step=1");
    expect(safeInternalPath("/generate-ikigai/card")).toBe("/generate-ikigai/card");
    expect(safeInternalPath("/\\evil.com")).toBeNull();
    expect(safeInternalPath("/\\\\evil.com")).toBeNull();
    expect(safeInternalPath("//evil.com")).toBeNull();
    expect(safeInternalPath("https://evil.com")).toBeNull();
    expect(safeInternalPath("/\tevil.com")).toBeNull();
    expect(sanitizeRedirect("/\\evil.com")).toBe("/dashboard");
    expect(sanitizeRedirect("/\\evil.com", "/ikigai-finder")).toBe("/ikigai-finder");
  });
});
