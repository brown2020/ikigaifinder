import { useState } from "react";
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

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);

  const handleAuthError = (error: unknown) => {
    const firebaseError = error as AuthError;
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (firebaseError.code) {
      switch (firebaseError.code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          return; // Ignore user cancellations
        case "auth/user-not-found":
        case "auth/invalid-credential":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters long.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/quota-exceeded":
            errorMessage = "Daily email sign-in limit exceeded.";
            break;
        default:
          errorMessage = firebaseError.message || errorMessage;
      }
    }
    setError(errorMessage);
  };

  const signInWithGoogle = async (onSuccess?: () => void) => {
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
  };

  const loginWithEmail = async (email: string, password: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", email.split("@")[0]);
      onSuccess?.();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError("");
    try {
        // We don't actually use 'name' in the create call, but we store it in localStorage as per original code
      await createUserWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", name || email.split("@")[0]);
      onSuccess?.();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      clearAuthDetails();
      onSuccess?.();
    } catch (err) {
      setError("An error occurred while signing out.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMagicLink = async (email: string, name: string) => {
      setIsLoading(true);
      setError("");
      const actionCodeSettings = {
        url: `${window.location.origin}/loginfinish`,
        handleCodeInApp: true,
      };
  
      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem("ikigaiFinderEmail", email);
        window.localStorage.setItem("ikigaiFinderName", name);
        setAuthDetails({ authPending: true });
      } catch (error) {
        handleAuthError(error);
      } finally {
        setIsLoading(false);
      }
  }

  const resetPassword = async (email: string) => {
      setIsLoading(true);
      setError("");
      if (!email) {
          setError("Please enter your email to reset your password.");
          setIsLoading(false);
          return;
      }
      try {
          await sendPasswordResetEmail(auth, email);
          alert(`Password reset email sent to ${email}`);
      } catch (error) {
          handleAuthError(error);
      } finally {
          setIsLoading(false);
      }
  }

  return {
    isLoading,
    error,
    setError,
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    signOut,
    sendMagicLink,
    resetPassword
  };
};


