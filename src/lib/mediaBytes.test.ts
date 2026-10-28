import { describe, expect, it } from "vitest";
import { readBounded } from "./mediaBytes";

async function* chunks(parts: Uint8Array[]): AsyncGenerator<Uint8Array> {
  for (const part of parts) yield part;
}

describe("readBounded", () => {
  it("returns the bytes when they fit and stops when they do not", async () => {
    const small = await readBounded(chunks([Uint8Array.from([1, 2]), Uint8Array.from([3])]), 3);
    expect(small?.equals(Buffer.from([1, 2, 3]))).toBe(true);
    expect(await readBounded(chunks([Uint8Array.from([1, 2, 3, 4])]), 3)).toBeNull();
  });
});
