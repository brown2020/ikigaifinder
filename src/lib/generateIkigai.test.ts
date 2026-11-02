import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEXT_MODEL, TEXT_PROVIDER_OPTIONS } from "@/constants/ai";
import type { IkigaiData } from "@/types";

type StreamResult = { updates: IkigaiData[][]; error?: Error };

const { requireAuth, streamText } = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  streamText: vi.fn(),
}));

vi.mock("@/lib/auth/session-server", () => ({ requireAuth }));
vi.mock("@ai-sdk/openai", () => ({ openai: (id: string) => ({ id }) }));
vi.mock("@ai-sdk/rsc", () => ({
  createStreamableValue: () => {
    const updates: IkigaiData[][] = [];
    let settle: (result: StreamResult) => void = () => {};
    const finished = new Promise<StreamResult>((resolve) => {
      settle = resolve;
    });
    const stream = {
      update(value: IkigaiData[]) {
        updates.push(value.map((item) => ({ ...item })));
        return stream;
      },
      error(error: Error) {
        settle({ updates, error });
        return stream;
      },
      done() {
        settle({ updates });
        return stream;
      },
      get value() {
        return finished;
      },
    };
    return stream;
  },
}));
vi.mock("ai", async (importOriginal) => ({ ...(await importOriginal<typeof import("ai")>()), streamText }));

const { generateIkigai } = await import("./generateIkigai");
const { rateLimitAI } = await import("./rateLimit");

function elementStreamOf(...elements: unknown[]) {
  return {
    elementStream: (async function* () {
      for (const element of elements) yield element;
    })(),
  };
}

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
    while ((await rateLimitAI("busy-user")).success) {
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

  it("streams a normalized statement and keeps the configured text model", async () => {
    requireAuth.mockResolvedValue({ uid: "happy-user" });
    streamText.mockReturnValue(
      elementStreamOf({
        statement: "my ikigai is to teach people to build useful things",
        passion: 80,
        mission: 70,
        vocation: 60,
        profession: 75,
        overall: 72,
      })
    );

    const stream = await generateIkigai(questions, "keep it concrete");
    const result = await (stream as unknown as Promise<StreamResult>);

    expect(result.error).toBeUndefined();
    expect(result.updates.at(-1)).toEqual([
      {
        ikigai: "My ikigai is to teach people to build useful things",
        Passion: 80,
        Mission: 70,
        Vocation: 60,
        Profession: 75,
        OverallCompatibility: 72,
      },
    ]);
    expect(streamText).toHaveBeenCalledTimes(1);
    expect(streamText.mock.calls[0][0]).toMatchObject({
      model: { id: TEXT_MODEL },
      providerOptions: TEXT_PROVIDER_OPTIONS,
    });
  });

  it("tells the reader when the model returns no statements", async () => {
    requireAuth.mockResolvedValue({ uid: "empty-user" });
    streamText.mockReturnValue(elementStreamOf());
    const stream = await generateIkigai(questions);
    const result = await (stream as unknown as Promise<StreamResult>);
    expect(result.updates).toEqual([]);
    expect(result.error?.message).toMatch(/couldn't generate ideas/i);
  });
});
