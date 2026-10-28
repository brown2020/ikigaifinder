import { describe, expect, it, vi } from "vitest";
import { canReadStoredObject } from "./mediaAccess";

const cover = vi.fn(async () => ({ sharable: true, coverPath: "generated/alice/cover.jpg" }));

describe("canReadStoredObject", () => {
  it("lets the owner read their files and visitors read only the public cover", async () => {
    expect(await canReadStoredObject("generated/alice/cover.jpg", "alice", cover)).toBe(true);
    expect(await canReadStoredObject("users/alice/profile.png", "alice", cover)).toBe(true);
    expect(cover).not.toHaveBeenCalled();

    expect(await canReadStoredObject("generated/alice/cover.jpg", null, cover)).toBe(true);
    expect(await canReadStoredObject("generated/alice/other.jpg", null, cover)).toBe(false);
    expect(await canReadStoredObject("users/alice/profile.png", null, cover)).toBe(false);
    expect(await canReadStoredObject("generated/alice/../secret.jpg", null, cover)).toBe(false);
    expect(await canReadStoredObject("generated/alice/..", "alice", cover)).toBe(false);

    cover.mockResolvedValueOnce({ sharable: false, coverPath: "generated/alice/cover.jpg" });
    expect(await canReadStoredObject("generated/alice/cover.jpg", "mallory", cover)).toBe(false);
  });
});
