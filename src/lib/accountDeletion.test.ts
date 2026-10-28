import { describe, expect, it } from "vitest";
import { AccountDeletionError, deleteAccountData, userDocumentPaths, userStoragePrefixes } from "./accountDeletion";

function fakes({ failStep, authCode }: { failStep?: "storage" | "firestore"; authCode?: string } = {}) {
  const calls: string[] = [];
  const db = {
    doc: (path: string) => ({ path }),
    recursiveDelete: async (ref: { path: string }) => {
      if (failStep === "firestore") throw Object.assign(new Error("boom"), { code: "unavailable" });
      calls.push(`firestore:${ref.path}`);
    },
  };
  const bucket = {
    deleteFiles: async ({ prefix }: { prefix: string }) => {
      if (failStep === "storage") throw Object.assign(new Error("boom"), { code: 503 });
      calls.push(`storage:${prefix}`);
    },
  };
  const auth = {
    deleteUser: async (uid: string) => {
      if (authCode) throw Object.assign(new Error("auth"), { code: authCode });
      calls.push(`auth:${uid}`);
    },
  };
  // The fakes implement only what deleteAccountData uses.
  return { calls, db: db as never, bucket, auth: auth as never };
}

describe("deleteAccountData", () => {
  it("deletes every storage prefix and document tree, then the Auth user last", async () => {
    const { calls, db, bucket, auth } = fakes();
    await deleteAccountData(db, bucket, auth, "user123");
    expect(calls).toEqual([
      ...userStoragePrefixes("user123").map((p) => `storage:${p}`),
      ...userDocumentPaths("user123").map((p) => `firestore:${p}`),
      "auth:user123",
    ]);
    expect(userStoragePrefixes("user123")).toEqual(["generated/user123/", "users/user123/"]);
    expect(userDocumentPaths("user123")).toEqual([
      "ikigaiUsers/user123",
      "ikigaiProfiles/user123",
      "_rateLimits/ai:user123",
      "_rateLimits/img:user123",
    ]);
  });

  it("treats an already-deleted Auth user as done, so retries finish", async () => {
    const { db, bucket, auth } = fakes({ authCode: "auth/user-not-found" });
    await expect(deleteAccountData(db, bucket, auth, "user123")).resolves.toBeUndefined();
  });

  it("stops before deleting the Auth user when data deletion fails, and names the step", async () => {
    const { calls, db, bucket, auth } = fakes({ failStep: "firestore" });
    const failure = await deleteAccountData(db, bucket, auth, "user123").catch((e: unknown) => e);
    expect(failure).toBeInstanceOf(AccountDeletionError);
    expect(failure).toMatchObject({ step: "firestore", causeCode: "unavailable" });
    expect(calls.some((c) => c.startsWith("auth:"))).toBe(false);
  });

  it("refuses uids that could escape their own paths", async () => {
    const { calls, db, bucket, auth } = fakes();
    await expect(deleteAccountData(db, bucket, auth, "a/../b")).rejects.toBeInstanceOf(AccountDeletionError);
    await expect(deleteAccountData(db, bucket, auth, "")).rejects.toBeInstanceOf(AccountDeletionError);
    expect(calls).toEqual([]);
  });
});
