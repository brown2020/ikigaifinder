const REJECTED_CODES = new Set([
  "auth/user-token-expired",
  "auth/user-disabled",
  "auth/id-token-revoked",
  "auth/invalid-user-token",
  "auth/user-not-found",
  "auth/argument-error",
]);

/** True only when the token itself was rejected. Network and server errors keep the existing cookie. */
export function shouldClearSessionAfterRefreshError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === "string" && REJECTED_CODES.has(code)) return true;
  if (error instanceof Error) {
    const status = /Failed to create session \((\d+)\)/.exec(error.message)?.[1];
    if (status === "401" || status === "403") return true;
  }
  return false;
}
