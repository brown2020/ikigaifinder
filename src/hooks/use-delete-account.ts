"use client";

import { useCallback, useRef, useState } from "react";
import { auth } from "@/firebase/firebaseClient";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { clearGuestAnswers } from "@/utils/guestDraft";

const SIGN_IN_AGAIN = "For your security, please sign out, sign in again, and then delete your account.";
const OFFLINE = "We couldn't reach Ikigai Finder. Check your connection and try again.";
const GENERIC = "We couldn't delete your account. Please try again.";

/** A failure whose message is safe to show as-is. */
class DeleteAccountError extends Error {}

async function requestAccountDeletion(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new DeleteAccountError(SIGN_IN_AGAIN);

  let idToken: string;
  try {
    // A forced refresh fails fast when the session was revoked, disabled, or expired.
    idToken = await user.getIdToken(true);
  } catch (error) {
    const code = (error as { code?: unknown } | null)?.code;
    throw new DeleteAccountError(code === "auth/network-request-failed" ? OFFLINE : SIGN_IN_AGAIN);
  }

  let response: Response;
  try {
    response = await fetch("/api/account", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${idToken}` },
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    throw new DeleteAccountError(OFFLINE);
  }

  if (response.status === 401) throw new DeleteAccountError(SIGN_IN_AGAIN);
  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as { error?: unknown } | null;
    throw new DeleteAccountError(typeof failure?.error === "string" && failure.error ? failure.error : GENERIC);
  }
  const body = (await response.json().catch(() => null)) as { deleted?: unknown } | null;
  if (body?.deleted !== true) throw new DeleteAccountError(GENERIC);
}

/** Deletes the signed-in account on the server, then runs the normal sign-out and clears local drafts. */
export function useDeleteAccount() {
  const { signOut } = useAuthActions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    if (inFlight.current) return false;
    inFlight.current = true;
    setIsDeleting(true);
    setError(null);
    try {
      await requestAccountDeletion();
      clearGuestAnswers();
      await signOut();
      return true;
    } catch (failure) {
      setError(failure instanceof DeleteAccountError ? failure.message : GENERIC);
      return false;
    } finally {
      inFlight.current = false;
      setIsDeleting(false);
    }
  }, [signOut]);

  return { deleteAccount, isDeleting, error };
}
