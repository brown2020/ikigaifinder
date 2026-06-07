import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the Firebase Admin SDK so importing the proxy never touches real credentials.
const verifySessionCookie = vi.fn();
vi.mock("@/firebase/firebaseAdmin", () => ({
  adminAuth: {
    verifySessionCookie: (...args: unknown[]) => verifySessionCookie(...args),
  },
}));

import proxy, { isApiRoute, isProtectedRoute } from "./proxy";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "__session";

function makeRequest(pathname: string, sessionCookie?: string): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  return {
    nextUrl: new URL(url),
    url,
    cookies: {
      get: (name: string) =>
        name === COOKIE_NAME && sessionCookie
          ? { value: sessionCookie }
          : undefined,
    },
  } as unknown as NextRequest;
}

beforeEach(() => {
  verifySessionCookie.mockReset();
});

describe("route matching", () => {
  it("treats configured protected segments as protected", () => {
    expect(isProtectedRoute("/dashboard")).toBe(true);
    expect(isProtectedRoute("/dashboard/anything")).toBe(true);
    expect(isProtectedRoute("/generate-ikigai")).toBe(true);
    expect(isProtectedRoute("/ikigai-finder")).toBe(true);
    expect(isProtectedRoute("/profile/edit")).toBe(true);
  });

  it("treats public/marketing routes as not protected", () => {
    expect(isProtectedRoute("/")).toBe(false);
    expect(isProtectedRoute("/about")).toBe(false);
    expect(isProtectedRoute("/ikigai/abc123")).toBe(false); // public share page
    expect(isProtectedRoute("/privacy-policy")).toBe(false);
  });

  it("does not protect lookalike prefixes", () => {
    expect(isProtectedRoute("/profiles")).toBe(false);
    expect(isProtectedRoute("/dashboardx")).toBe(false);
  });

  it("identifies API routes", () => {
    expect(isApiRoute("/api/auth/session")).toBe(true);
    expect(isApiRoute("/dashboard")).toBe(false);
  });
});

describe("proxy auth enforcement", () => {
  it("redirects unauthenticated users away from protected routes", async () => {
    const res = await proxy(makeRequest("/dashboard"));
    expect(res?.status).toBe(307);
    const location = res?.headers.get("location") ?? "";
    expect(location).toContain("/?redirect=");
    expect(location).toContain(encodeURIComponent("/dashboard"));
    expect(verifySessionCookie).not.toHaveBeenCalled();
  });

  it("redirects when the session cookie is present but invalid", async () => {
    verifySessionCookie.mockRejectedValueOnce(new Error("invalid"));
    const res = await proxy(makeRequest("/profile", "bad-cookie"));
    expect(res?.status).toBe(307);
    expect(verifySessionCookie).toHaveBeenCalledWith("bad-cookie", true);
  });

  it("allows authenticated users through to protected routes", async () => {
    verifySessionCookie.mockResolvedValueOnce({ uid: "user-1" });
    const res = await proxy(makeRequest("/generate-ikigai", "good-cookie"));
    expect(res?.headers.get("x-middleware-next")).toBe("1");
    expect(res?.headers.get("location")).toBeNull();
  });

  it("checks cookie revocation (verifySessionCookie called with checkRevoked=true)", async () => {
    verifySessionCookie.mockResolvedValueOnce({ uid: "user-1" });
    await proxy(makeRequest("/dashboard", "good-cookie"));
    expect(verifySessionCookie).toHaveBeenCalledWith("good-cookie", true);
  });
});
