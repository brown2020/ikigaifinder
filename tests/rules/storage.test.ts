import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { getBytes, ref, uploadBytes } from "firebase/storage";

// Hosts and ports are explicit, so skip hub discovery (the hub may bind a different interface).
delete process.env.FIREBASE_EMULATOR_HUB;

let env: RulesTestEnvironment;
const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-ikigaifinder",
    storage: { rules: readFileSync("storage.rules", "utf8"), host: "127.0.0.1", port: 9199 },
  });
});

afterAll(() => env?.cleanup());

beforeEach(async () => {
  await env.clearStorage();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await uploadBytes(ref(ctx.storage(), "generated/alice/card.png"), png, { contentType: "image/png" });
  });
});

const alice = () => env.authenticatedContext("alice").storage();
const mallory = () => env.authenticatedContext("mallory").storage();
const visitor = () => env.unauthenticatedContext().storage();

describe("storage.rules", () => {
  it("lets owners upload images to their own folders and read them back", async () => {
    await assertSucceeds(uploadBytes(ref(alice(), "generated/alice/new.png"), png, { contentType: "image/png" }));
    await assertSucceeds(uploadBytes(ref(alice(), "users/alice/profile.png"), png, { contentType: "image/png" }));
    await assertSucceeds(getBytes(ref(alice(), "generated/alice/card.png")));
  });

  it("denies other users and visitors", async () => {
    await assertFails(getBytes(ref(mallory(), "generated/alice/card.png")));
    await assertFails(uploadBytes(ref(mallory(), "generated/alice/evil.png"), png, { contentType: "image/png" }));
    await assertFails(getBytes(ref(visitor(), "generated/alice/card.png")));
  });

  it("rejects non-image uploads and unknown paths", async () => {
    await assertFails(uploadBytes(ref(alice(), "generated/alice/notes.html"), png, { contentType: "text/html" }));
    await assertFails(uploadBytes(ref(alice(), "public/alice.png"), png, { contentType: "image/png" }));
  });

  it("allows jpeg, png, and webp, and rejects svg", async () => {
    await assertSucceeds(uploadBytes(ref(alice(), "generated/alice/photo.jpg"), png, { contentType: "image/jpeg" }));
    await assertSucceeds(uploadBytes(ref(alice(), "generated/alice/photo.webp"), png, { contentType: "image/webp" }));
    await assertFails(uploadBytes(ref(alice(), "generated/alice/drawing.svg"), png, { contentType: "image/svg+xml" }));
  });
});
