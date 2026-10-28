import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Hosts and ports are explicit, so skip hub discovery (the hub may bind a different interface).
delete process.env.FIREBASE_EMULATOR_HUB;

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-ikigaifinder",
    firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8085 },
  });
});

afterAll(() => env?.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "ikigaiUsers/alice/ikigai/main"), { answers: [], ikigaiReport: { summary: "private" }, ikigaiSharableUrl: true });
    await setDoc(doc(db, "ikigaiUsers/alice/settings/profile"), { profile: { firstName: "Alice" } });
    await setDoc(doc(db, "ikigaiProfiles/alice/covers/one"), { downloadUrl: "https://example.com/a.png" });
  });
});

const alice = () => env.authenticatedContext("alice").firestore();
const mallory = () => env.authenticatedContext("mallory").firestore();
const visitor = () => env.unauthenticatedContext().firestore();

describe("firestore.rules", () => {
  it("lets owners read and write their own ikigai, profile, and covers", async () => {
    await assertSucceeds(getDoc(doc(alice(), "ikigaiUsers/alice/ikigai/main")));
    await assertSucceeds(setDoc(doc(alice(), "ikigaiUsers/alice/ikigai/main"), { answers: [] }, { merge: true }));
    await assertSucceeds(getDoc(doc(alice(), "ikigaiUsers/alice/settings/profile")));
    await assertSucceeds(setDoc(doc(alice(), "ikigaiProfiles/alice/covers/two"), { downloadUrl: "x" }));
  });

  it("denies another signed-in user every read and write", async () => {
    await assertFails(getDoc(doc(mallory(), "ikigaiUsers/alice/ikigai/main")));
    await assertFails(setDoc(doc(mallory(), "ikigaiUsers/alice/ikigai/main"), { ikigaiSharableUrl: false }, { merge: true }));
    await assertFails(getDoc(doc(mallory(), "ikigaiUsers/alice/settings/profile")));
    await assertFails(getDoc(doc(mallory(), "ikigaiProfiles/alice/covers/one")));
    await assertFails(setDoc(doc(mallory(), "ikigaiUsers/alice"), { email: "x" }));
  });

  it("never exposes a shared ikigai doc to visitors; share pages read through the Admin SDK", async () => {
    await assertFails(getDoc(doc(visitor(), "ikigaiUsers/alice/ikigai/main")));
    await assertFails(getDoc(doc(visitor(), "ikigaiProfiles/alice/covers/one")));
  });

  it("denies paths outside the app's collections", async () => {
    await assertFails(setDoc(doc(alice(), "admin/config"), { open: true }));
    await assertFails(getDoc(doc(alice(), "ikigaiUsersExtra/alice")));
  });

  it("rejects oversized fields, a non-boolean share flag, and client access to quotas", async () => {
    await assertFails(setDoc(doc(alice(), "ikigaiUsers/alice/ikigai/main"), { blob: "x".repeat(930_000) }));
    await assertFails(setDoc(doc(alice(), "ikigaiUsers/alice/ikigai/main"), { ikigaiGuidance: "x".repeat(3000) }, { merge: true }));
    await assertFails(setDoc(doc(alice(), "ikigaiUsers/alice/ikigai/main"), { ikigaiSharableUrl: "yes" }, { merge: true }));
    await assertSucceeds(setDoc(doc(alice(), "ikigaiUsers/alice/ikigai/main"), { ikigaiGuidance: "more hands-on" }, { merge: true }));
    await assertFails(getDoc(doc(alice(), "_rateLimits/ai:alice")));
    await assertFails(setDoc(doc(alice(), "_rateLimits/ai:alice"), { count: 0 }));
  });
});
