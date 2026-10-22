import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAuth, streamText } = vi.hoisted(() => ({ requireAuth: vi.fn(), streamText: vi.fn() }));

vi.mock("@/lib/auth/session-server", () => ({ requireAuth }));
vi.mock("@ai-sdk/openai", () => ({ openai: () => ({}) }));
vi.mock("ai", async (importOriginal) => ({ ...(await importOriginal<typeof import("ai")>()), streamText }));

const { generateIkigai } = await import("./generateIkigai");
const { rateLimitAI } = await import("./rateLimit");

const questions = [{ id: "passion", questions: [{ question: "What do you love?", answer: ["Teaching"] }] }];

describe("generateIkigai server action", () => {
  beforeEach(() => {
    requireAuth.mockReset();
    streamText.mockReset();
  });

  it("refuses callers without a session and never calls the model", async () => {
    requireAuth.mockRejectedValue(new Error("Unauthorized"));
    await expect(generateIkigai(questions)).rejects.toThrow(/signed in/i);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("stops a signed-in user who exceeds the AI rate limit before calling the model", async () => {
    requireAuth.mockResolvedValue({ uid: "busy-user" });
    while (rateLimitAI("busy-user").success) {
      // exhaust this user's window
    }
    await expect(generateIkigai(questions)).rejects.toThrow(/try again in/i);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("rejects malformed input before calling the model", async () => {
    requireAuth.mockResolvedValue({ uid: "careful-user" });
    await expect(generateIkigai([] as never)).rejects.toThrow(/couldn't be read/i);
    expect(streamText).not.toHaveBeenCalled();
  });
});
