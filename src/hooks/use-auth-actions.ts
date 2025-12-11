"use client";

import { useState, useCallback } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendSignInLinkToEmail,
  sendPasswordResetEmail,
  AuthError,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand";

// ============================================================================
// Types
// ============================================================================

interface UseAuthActionsReturn {
  /** Whether an auth action is in progress */
  isLoading: boolean;
  /** Current error message, if any */
  error: string;
  /** Clear the current error */
  clearError: () => void;
  /** Sign in with Google OAuth */
  signInWithGoogle: (onSuccess?: () => void) => Promise<void>;
  /** Sign in with email and password */
  loginWithEmail: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  /** Sign up with email and password */
  signupWithEmail: (email: string, password: string, name: string, onSuccess?: () => void) => Promise<void>;
  /** Sign out the current user */
  signOut: (onSuccess?: () => void) => Promise<void>;
  /** Send a magic link for passwordless sign-in */
  sendMagicLink: (email: string, name: string) => Promise<boolean>;
  /** Send a password reset email */
  resetPassword: (email: string) => Promise<boolean>;
}

// ============================================================================
// Error Messages
// ============================================================================

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "Invalid email or password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters long.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/quota-exceeded": "Daily email sign-in limit exceeded.",
};

const SILENT_ERROR_CODES = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"];

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for Firebase authentication actions
 * 
 * Provides methods for:
 * - Google OAuth sign-in
 * - Email/password authentication
 * - Magic link (passwordless) authentication
 * - Password reset
 * - Sign out
 */
export function useAuthActions(): UseAuthActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);

  /**
   * Clear the current error state
   */
  const clearError = useCallback(() => {
    setError("");
  }, []);

  /**
   * Handle Firebase auth errors with user-friendly messages
   */
  const handleAuthError = useCallback((err: unknown): void => {
    const firebaseError = err as AuthError;
    
    // Ignore user cancellations
    if (firebaseError.code && SILENT_ERROR_CODES.includes(firebaseError.code)) {
      return;
    }

    const errorMessage = 
      ERROR_MESSAGES[firebaseError.code] ?? 
      firebaseError.message ?? 
      "An unexpected error occurred. Please try again.";

    setError(errorMessage);
  }, []);

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = useCallback(async (onSuccess?: () => void): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSuccess?.();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  /**
   * Sign in with email and password
   */
  const loginWithEmail = useCallback(async (
    email: string, 
    password: string, 
    onSuccess?: () => void
  ): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Store for form pre-fill
      if (typeof window !== "undefined") {
        window.localStorage.setItem("generateEmail", email);
        window.localStorage.setItem("generateName", email.split("@")[0]);
      }
      
      onSuccess?.();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  /**
   * Sign up with email and password
   */
  const signupWithEmail = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    onSuccess?: () => void
  ): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Store for form pre-fill
      if (typeof window !== "undefined") {
        window.localStorage.setItem("generateEmail", email);
        window.localStorage.setItem("generateName", name || email.split("@")[0]);
      }
      
      onSuccess?.();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async (onSuccess?: () => void): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      await firebaseSignOut(auth);
      clearAuthDetails();
      onSuccess?.();
    } catch {
      setError("An error occurred while signing out.");
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthDetails]);

  /**
   * Send a magic link for passwordless sign-in
   */
  const sendMagicLink = useCallback(async (email: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");

    const actionCodeSettings = {
      url: `${typeof window !== "undefined" ? window.location.origin : ""}/loginfinish`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ikigaiFinderEmail", email);
        window.localStorage.setItem("ikigaiFinderName", name);
      }
      
      setAuthDetails({ authPending: true });
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError, setAuthDetails]);

  /**
   * Send a password reset email
   */
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    if (!email) {
      setError("Please enter your email to reset your password.");
      return false;
    }

    setIsLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  return {
    isLoading,
    error,
    clearError,
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    signOut,
    sendMagicLink,
    resetPassword,
  };
}

// Legacy export for backward compatibility
export { useAuthActions as default };



