"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getIdToken } from "firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import { debounce } from "lodash";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUserDetailsInFirestore } from "@/services/userService";

// ============================================================================
// Constants
// ============================================================================

const TOKEN_REFRESH_INTERVAL_MS = 50 * 60 * 1000; // 50 minutes
const DEBOUNCE_DELAY_MS = 1000;

// ============================================================================
// Types
// ============================================================================

interface UseAuthTokenOptions {
  /** Cookie name to store the auth token */
  cookieName?: string;
  /** Whether to auto-refresh the token */
  autoRefresh?: boolean;
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
// Utility Functions
// ============================================================================

/**
 * Check if we're running in a React Native WebView
 */
function isReactNativeWebView(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.ReactNativeWebView !== "undefined";
}

/**
 * Get the last token refresh key for localStorage
 */
function getLastTokenRefreshKey(cookieName: string): string {
  return `lastTokenRefresh_${cookieName}`;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook to manage Firebase authentication token
 * 
 * Handles:
 * - Token refresh on a regular interval
 * - Cookie management for auth state
 * - Syncing auth state to Zustand store
 * - Syncing user details to Firestore
 */
export function useAuthToken(options: UseAuthTokenOptions = {}): UseAuthTokenReturn {
  const { 
    cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME ?? "authToken",
    autoRefresh = true 
  } = options;

  const [user, isLoading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);
  
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTokenRefreshKey = getLastTokenRefreshKey(cookieName);

  /**
   * Refresh the auth token and update the cookie
   */
  const refreshAuthToken = useCallback(async (): Promise<void> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      const idToken = await getIdToken(currentUser, true);

      setCookie(cookieName, idToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // Token expires in 1 hour, but we refresh every 50 minutes
        maxAge: 60 * 60,
      });

      if (!isReactNativeWebView()) {
        window.localStorage.setItem(lastTokenRefreshKey, Date.now().toString());
      }
    } catch (err) {
      console.error("Failed to refresh auth token:", err);
      deleteCookie(cookieName);
    }
  }, [cookieName, lastTokenRefreshKey]);

  /**
   * Schedule the next token refresh
   */
  const scheduleTokenRefresh = useCallback((): void => {
    if (!autoRefresh) return;

    // Clear existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = null;
    }

    // Only schedule if document is visible
    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      activityTimeoutRef.current = setTimeout(refreshAuthToken, TOKEN_REFRESH_INTERVAL_MS);
    }
  }, [autoRefresh, refreshAuthToken]);

  /**
   * Handle cross-tab storage changes for token sync
   */
  const handleStorageChange = useCallback(
    debounce((event: StorageEvent) => {
      if (event.key === lastTokenRefreshKey) {
        scheduleTokenRefresh();
      }
    }, DEBOUNCE_DELAY_MS),
    [lastTokenRefreshKey, scheduleTokenRefresh]
  );

  // Set up storage event listener for cross-tab sync
  useEffect(() => {
    if (isReactNativeWebView()) return;

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      handleStorageChange.cancel();
      
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [handleStorageChange]);

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
      
      // IMPORTANT: Set the cookie immediately when user signs in
      // This is needed for the proxy/middleware to allow authenticated routes
      refreshAuthToken();
      
      // Then schedule future token refreshes
      scheduleTokenRefresh();
    } else if (!isLoading) {
      clearAuthDetails();
      deleteCookie(cookieName);
    }
  }, [user, isLoading, setAuthDetails, clearAuthDetails, cookieName, scheduleTokenRefresh, refreshAuthToken]);

  return {
    uid: user?.uid,
    isLoading,
    error,
    refreshToken: refreshAuthToken,
  };
}

// Default export for backward compatibility
export default useAuthToken;

