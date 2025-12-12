"use client";

import { useEffect, useCallback, useRef } from "react";
import { getIdToken } from "firebase/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUserDetailsInFirestore } from "@/services/userService";
import { isReactNativeWebView } from "@/utils/platform";
import { clearServerSession, createServerSession } from "@/lib/auth/session-client";

// ============================================================================
// Constants
// ============================================================================

const SESSION_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================================
// Types
// ============================================================================

interface UseAuthTokenOptions {
  /** Whether to periodically refresh the server session cookie */
  autoRefreshSession?: boolean;
}

interface UseAuthTokenReturn {
  /** Current user's UID */
  uid: string | undefined;
  /** Whether the auth state is still loading */
  isLoading: boolean;
  /** Any error that occurred during auth */
  error: Error | undefined;
  /** Manually refresh the auth token */
  refreshToken: () => Promise<void>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook to bridge Firebase client auth -> server session cookie
 *
 * Handles:
 * - Creating an httpOnly server session cookie after sign-in
 * - Periodic session refresh (optional)
 * - Syncing auth state to Zustand store
 * - Syncing user details to Firestore
 */
export function useAuthToken(
  options: UseAuthTokenOptions = {}
): UseAuthTokenReturn {
  const {
    autoRefreshSession = true,
  } = options;

  const [user, isLoading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Create/refresh the server session cookie using the current Firebase ID token.
   */
  const refreshServerSession = useCallback(async (): Promise<void> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      const idToken = await getIdToken(currentUser, true);
      await createServerSession(idToken);
    } catch (err) {
      console.error("Failed to refresh server session:", err);
      // If we can't refresh the session, ensure we clear it so proxy blocks protected routes.
      try {
        await clearServerSession();
      } catch {
        // ignore
      }
    }
  }, []);

  // Sync user state to Zustand and Firestore
  useEffect(() => {
    if (user?.uid) {
      const authDetails = {
        uid: user.uid,
        authEmail: user.email ?? "",
        authDisplayName: user.displayName ?? "",
        authPhotoUrl: user.photoURL ?? "",
        authEmailVerified: user.emailVerified ?? false,
        authReady: true,
        authPending: false,
      };

      setAuthDetails(authDetails);

      // Sync to Firestore (fire and forget)
      updateUserDetailsInFirestore(authDetails, user.uid);

      // IMPORTANT: Create/refresh the server session cookie when user signs in.
      refreshServerSession();
    } else if (!isLoading) {
      clearAuthDetails();
      // Clear any existing server session cookie on sign-out.
      clearServerSession().catch(() => {});
    }
  }, [
    user,
    isLoading,
    setAuthDetails,
    clearAuthDetails,
    refreshServerSession,
  ]);

  // Optionally refresh the server session periodically for long-lived Firebase sessions.
  useEffect(() => {
    if (!autoRefreshSession) return;
    if (!user?.uid) return;
    if (isReactNativeWebView()) return;

    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    refreshIntervalRef.current = setInterval(() => {
      // Only refresh when visible to avoid background churn.
      if (document.visibilityState === "visible") {
        refreshServerSession();
      }
    }, SESSION_REFRESH_INTERVAL_MS);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [autoRefreshSession, user?.uid, refreshServerSession]);

  return {
    uid: user?.uid,
    isLoading,
    error,
    refreshToken: refreshServerSession,
  };
}
