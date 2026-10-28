// Server-only: called by /api/account with Admin SDK handles. Never import from client code.
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

/** Every Firestore document tree and Storage prefix that holds one person's data. Add new per-user paths here. */
export const userDocumentPaths = (uid: string) => [
  `ikigaiUsers/${uid}`,
  `ikigaiProfiles/${uid}`,
  `_rateLimits/ai:${uid}`,
  `_rateLimits/img:${uid}`,
];
export const userStoragePrefixes = (uid: string) => [`generated/${uid}/`, `users/${uid}/`];

export type AccountDeletionStep = "storage" | "firestore" | "auth";

/** Carries only a step name and an SDK error code, so logs never include user data. */
export class AccountDeletionError extends Error {
  constructor(public step: AccountDeletionStep, public causeCode: string) {
    super(`Account deletion failed during ${step}`);
    this.name = "AccountDeletionError";
  }
}

export interface AccountDeletionBucket {
  deleteFiles(query: { prefix: string }): Promise<unknown>;
}

type AccountDeletionDb = Pick<Firestore, "doc" | "recursiveDelete">;

function errorCode(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" || typeof code === "number" ? String(code) : "unknown";
}

async function step(name: AccountDeletionStep, action: () => Promise<unknown>): Promise<void> {
  try {
    await action();
  } catch (error) {
    throw new AccountDeletionError(name, errorCode(error));
  }
}

/**
 * Deletes every file, document, and finally the Auth account for one verified uid. It is never
 * refused, and every step is idempotent, so retrying after a partial failure finishes the job.
 */
export async function deleteAccountData(
  db: AccountDeletionDb,
  bucket: AccountDeletionBucket,
  auth: Pick<Auth, "deleteUser">,
  uid: string
): Promise<void> {
  if (!uid || uid.length > 128 || uid.includes("/")) throw new AccountDeletionError("auth", "invalid-uid");

  await step("storage", () => Promise.all(userStoragePrefixes(uid).map((prefix) => bucket.deleteFiles({ prefix }))));
  await step("firestore", () => Promise.all(userDocumentPaths(uid).map((path) => db.recursiveDelete(db.doc(path)))));
  await step("auth", async () => {
    try {
      await auth.deleteUser(uid);
    } catch (error) {
      if (errorCode(error) !== "auth/user-not-found") throw error;
    }
  });
}
