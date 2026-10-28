import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAuth, providerImage, save, getSignedUrl, file } = vi.hoisted(() => {
  const save = vi.fn();
  const getSignedUrl = vi.fn();
  return { requireAuth: vi.fn(), providerImage: vi.fn(), save, getSignedUrl, file: vi.fn((path: string) => { void path; return { save, getSignedUrl }; }) };
});

vi.mock("@/lib/auth/session-server", () => ({ requireAuth }));
vi.mock("@/firebase/firebaseAdmin", () => ({ adminBucket: { file } }));
vi.mock("@ai-sdk/openai", () => ({ openai: { image: (id: string) => ({ id }) } }));
vi.mock("ai", async (importOriginal) => ({ ...(await importOriginal<typeof import("ai")>()), generateImage: providerImage }));

const { generateImage } = await import("./generateImage");
const { APICallError } = await import("ai");
const { IMAGE_MODEL } = await import("@/constants/ai");

const prompt = "A calm workshop at dawn with tools on a wooden bench";

describe("generateImage server action", () => {
  beforeEach(() => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    for (const fn of [requireAuth, providerImage, save, getSignedUrl, file]) fn.mockClear();
    requireAuth.mockResolvedValue({ uid: `user-${Math.random()}` });
    providerImage.mockResolvedValue({ image: { uint8Array: new Uint8Array(4096) } });
    getSignedUrl.mockResolvedValue(["https://storage.googleapis.com/bucket/generated/u/1.jpg"]);
  });

  it("refuses callers without a session before calling the provider", async () => {
    requireAuth.mockRejectedValue(new Error("Unauthorized"));
    expect(await generateImage(prompt)).toEqual({ error: "You must be signed in to generate images." });
    expect(providerImage).not.toHaveBeenCalled();
  });

  it("makes exactly one provider attempt with the configured model, then stores the JPEG under the caller's folder", async () => {
    requireAuth.mockResolvedValue({ uid: "alice" });
    const result = await generateImage(prompt);
    expect(result.imageUrl).toMatch(/^\/api\/media\?object=generated%2Falice%2F\d+\.jpg$/);
    expect(getSignedUrl).not.toHaveBeenCalled();
    expect(providerImage).toHaveBeenCalledTimes(1);
    expect(providerImage.mock.calls[0][0]).toMatchObject({ model: { id: IMAGE_MODEL }, maxRetries: 0, n: 1, size: "1024x1024" });
    expect(file.mock.calls[0][0]).toMatch(/^generated\/alice\/\d+\.jpg$/);
    expect(save.mock.calls[0][1]).toMatchObject({ contentType: "image/jpeg" });
  });

  it("maps provider rate limits to a friendly message without storing anything", async () => {
    providerImage.mockRejectedValue(new APICallError({ message: "slow down", url: "https://api.openai.com", requestBodyValues: {}, statusCode: 429 }));
    expect(await generateImage(prompt)).toEqual({ error: "Image generation service is busy. Please try again in a moment.", rateLimited: true });
    expect(save).not.toHaveBeenCalled();
  });

  it("rejects a restricted prompt before the quota or the provider", async () => {
    requireAuth.mockResolvedValue({ uid: "alice" });
    const result = await generateImage("A nude portrait in a studio with soft light");
    expect(result).toEqual({ error: "Unable to generate image with this prompt. Please try a different description." });
    expect(providerImage).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it("rejects an empty provider payload", async () => {
    providerImage.mockResolvedValue({ image: { uint8Array: new Uint8Array(10) } });
    expect(await generateImage(prompt)).toEqual({ error: "Failed to generate image. Please try again." });
    expect(save).not.toHaveBeenCalled();
  });
});
