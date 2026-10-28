import { describe, expect, it } from "vitest";
import { firestoreRateLimit, type RateLimitDb } from "./rateLimit";

function sharedDb(): RateLimitDb {
  const docs = new Map<string, { count: number; windowStart: number }>();
  return {
    doc(path: string) {
      return { path };
    },
    async runTransaction(update) {
      return update({
        async get(ref) {
          const path = (ref as { path: string }).path;
          const data = docs.get(path);
          return { exists: Boolean(data), data: () => data };
        },
        set(ref, data) {
          docs.set((ref as { path: string }).path, data);
        },
      });
    },
  };
}

describe("firestoreRateLimit", () => {
  it("shares one window across limiter instances and fails closed", async () => {
    const db = sharedDb();
    const first = await firestoreRateLimit(db, "ai:alice", { limit: 1, windowMs: 60_000 });
    const second = await firestoreRateLimit(db, "ai:alice", { limit: 1, windowMs: 60_000 });
    expect(first.success).toBe(true);
    expect(second.success).toBe(false);

    const broken: RateLimitDb = {
      doc: () => ({}),
      runTransaction: async () => {
        throw new Error("unavailable");
      },
    };
    expect((await firestoreRateLimit(broken, "ai:alice", { limit: 5 })).success).toBe(false);
    expect((await firestoreRateLimit(db, "../ai:alice", { limit: 5 })).success).toBe(false);
  });
});
