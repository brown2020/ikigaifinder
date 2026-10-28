import { beforeEach, describe, expect, it, vi } from "vitest";

const { getOptionalServerUid, getIkigaiSummary, readStoredObject } = vi.hoisted(() => ({
  getOptionalServerUid: vi.fn(),
  getIkigaiSummary: vi.fn(),
  readStoredObject: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session-server", () => ({ getOptionalServerUid }));
vi.mock("@/lib/ikigaiServer", () => ({ getIkigaiSummary }));
vi.mock("@/lib/mediaRead", () => ({ readStoredObject }));
vi.mock("@/firebase/firebaseAdmin", () => ({ adminBucket: {}, adminDb: {}, adminAuth: {} }));

const { serveStoredMedia } = await import("./serveMedia");
const { GET: download } = await import("@/app/api/downloadImage/route");
const { NextRequest } = await import("next/server");

const jpeg = Buffer.from("jpeg");

describe("serveStoredMedia", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGEBUCKET", "ikigaifinderai.appspot.com");
    getOptionalServerUid.mockReset();
    getIkigaiSummary.mockReset();
    readStoredObject.mockReset();
    readStoredObject.mockResolvedValue({ ok: true, body: { bytes: jpeg, contentType: "image/jpeg" } });
    vi.stubGlobal("fetch", () => {
      throw new Error("caller URLs must not be fetched");
    });
  });

  it("serves an owner and a public cover, and refuses everyone else", async () => {
    getOptionalServerUid.mockResolvedValue("alice");
    const owned = await serveStoredMedia("generated/alice/1.jpg", false);
    expect(owned.status).toBe(200);
    expect(owned.headers.get("cache-control")).toBe("private, no-store");
    expect(readStoredObject).toHaveBeenCalledWith("generated/alice/1.jpg");

    getOptionalServerUid.mockResolvedValue("mallory");
    getIkigaiSummary.mockResolvedValue({ coverImage: "/api/media?object=generated%2Falice%2F1.jpg", sharable: false });
    const hidden = await serveStoredMedia("generated/alice/1.jpg", false);
    expect(hidden.status).toBe(403);
    expect(readStoredObject).toHaveBeenCalledTimes(1);

    getOptionalServerUid.mockResolvedValue(null);
    getIkigaiSummary.mockResolvedValue({ coverImage: "/api/media?object=generated%2Falice%2F1.jpg", sharable: true });
    const shared = await serveStoredMedia("generated/alice/1.jpg", false);
    expect(shared.status).toBe(200);

    const photo = await serveStoredMedia("users/alice/profile.png", false);
    expect(photo.status).toBe(403);
  });

  it("downloads through the admin SDK and never fetches the caller URL", async () => {
    getOptionalServerUid.mockResolvedValue("alice");
    const url = "https://storage.googleapis.com/ikigaifinderai.appspot.com/generated/alice/1.jpg?X-Goog-Signature=secret";
    const res = await download(new NextRequest(`http://localhost/api/downloadImage?url=${encodeURIComponent(url)}`));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toContain("attachment");
    expect(readStoredObject).toHaveBeenCalledWith("generated/alice/1.jpg");
  });

  it("propagates a size refusal", async () => {
    getOptionalServerUid.mockResolvedValue("alice");
    readStoredObject.mockResolvedValue({ ok: false, status: 413, error: "Image file too large" });
    const res = await serveStoredMedia("generated/alice/1.jpg", true);
    expect(res.status).toBe(413);
  });
});
