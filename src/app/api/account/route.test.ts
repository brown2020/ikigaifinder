import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { verifyIdToken, deleteAccountData } = vi.hoisted(() => ({ verifyIdToken: vi.fn(), deleteAccountData: vi.fn() }));

vi.mock("@/firebase/firebaseAdmin", () => ({ adminAuth: { verifyIdToken }, adminDb: {}, adminBucket: {} }));
vi.mock("@/lib/accountDeletion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/accountDeletion")>()),
  deleteAccountData,
}));

const { DELETE } = await import("./route");
const { AccountDeletionError } = await import("@/lib/accountDeletion");

const del = (headers: Record<string, string> = {}) =>
  DELETE(new NextRequest("http://localhost/api/account", { method: "DELETE", headers }));

describe("DELETE /api/account", () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
    deleteAccountData.mockReset();
  });

  it("rejects requests without a bearer token", async () => {
    const res = await del();
    expect(res.status).toBe(401);
    expect(deleteAccountData).not.toHaveBeenCalled();
  });

  it("rejects invalid or revoked tokens, checking revocation", async () => {
    verifyIdToken.mockRejectedValue(Object.assign(new Error("revoked"), { code: "auth/id-token-revoked" }));
    const res = await del({ authorization: "Bearer stale" });
    expect(res.status).toBe(401);
    expect(verifyIdToken).toHaveBeenCalledWith("stale", true);
    expect(deleteAccountData).not.toHaveBeenCalled();
  });

  it("deletes only the token's own uid, never one from the request", async () => {
    verifyIdToken.mockResolvedValue({ uid: "alice" });
    const res = await DELETE(
      new NextRequest("http://localhost/api/account?uid=bob", {
        method: "DELETE",
        headers: { authorization: "Bearer good" },
        body: JSON.stringify({ uid: "bob" }),
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ deleted: true });
    expect(deleteAccountData).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), "alice");
    expect(res.headers.get("set-cookie")).toMatch(/Max-Age=0/i);
  });

  it("reports a retryable failure without leaking details", async () => {
    verifyIdToken.mockResolvedValue({ uid: "alice" });
    deleteAccountData.mockRejectedValue(new AccountDeletionError("storage", "503"));
    const res = await del({ authorization: "Bearer good" });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/try again/i);
    expect(JSON.stringify(body)).not.toMatch(/alice|storage|503/);
  });
});
