import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { setDoc, viewer } = vi.hoisted(() => ({ setDoc: vi.fn(), viewer: { uid: null as string | null } }));

vi.mock("@/lib/auth/session-server", () => ({ getOptionalServerUid: async () => viewer.uid }));
vi.mock("@/firebase/firebaseAdmin", () => {
  const chain = { collection: () => chain, doc: () => chain, set: setDoc };
  return { adminDb: chain };
});

const { PATCH } = await import("./route");

const patch = (body: unknown) =>
  PATCH(new NextRequest("http://localhost/api/ikigai/sharing", { method: "PATCH", body: JSON.stringify(body) }));

describe("PATCH /api/ikigai/sharing", () => {
  beforeEach(() => {
    setDoc.mockReset();
    viewer.uid = null;
  });

  it("rejects callers without a verified session", async () => {
    const res = await patch({ userId: "alice", sharable: true });
    expect(res.status).toBe(401);
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("refuses to change someone else's sharing", async () => {
    viewer.uid = "mallory";
    const res = await patch({ userId: "alice", sharable: true });
    expect(res.status).toBe(403);
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("rejects malformed bodies", async () => {
    viewer.uid = "alice";
    const res = await patch({ userId: "alice", sharable: "yes" });
    expect(res.status).toBe(400);
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("lets owners change their own sharing", async () => {
    viewer.uid = "alice";
    const res = await patch({ userId: "alice", sharable: true });
    expect(res.status).toBe(200);
    expect(setDoc).toHaveBeenCalledWith({ ikigaiSharableUrl: true }, { merge: true });
  });
});
