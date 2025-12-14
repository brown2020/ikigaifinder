"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/zustand";
import { selectAuthRedirectPath } from "@/zustand/useUIStore";
import AuthForm from "./AuthForm";
import SocialLogin from "./SocialLogin";
import AuthPending from "./AuthPending";
import SignedInView from "./SignedInView";

// ============================================================================
// Types
// ============================================================================

type AuthTab = "signin" | "signup";

// ============================================================================
// Constants
// ============================================================================

const TAB_CLASSES = {
  active: "text-blue-600 border-b-2 border-blue-600 bg-blue-50",
  inactive: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * Authentication Modal Component
 *
 * Renders a modal dialog for user authentication that supports:
 * - Email/password sign in and sign up
 * - Google OAuth
 * - Magic link (passwordless) authentication
 * - Password reset
 */
export default function AuthModal(): React.ReactElement | null {
  const router = useRouter();
  const isOpen = useUIStore((state) => state.isAuthModalOpen);
  const close = useUIStore((state) => state.closeAuthModal);
  const authRedirectPath = useUIStore(selectAuthRedirectPath);
  const { uid, authPending } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");

  /**
   * Reset modal state when it opens/closes
   */
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("signin");
    }
  }, [isOpen]);

  /**
   * Handle ESC key to close modal
   */
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  /**
   * Auto-close modal when user signs in
   */
  useEffect(() => {
    if (uid && isOpen) {
      close();
    }
  }, [uid, isOpen, close]);

  /**
   * Handle clicks outside the modal to close it
   */
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        close();
      }
    },
    [close]
  );

  /**
   * Handle successful authentication
   */
  const handleSuccess = useCallback((): void => {
    close();
    if (authRedirectPath) {
      router.push(authRedirectPath);
    }
  }, [authRedirectPath, close, router]);

  /**
   * Handle pending auth reset
   */
  const handlePendingReset = useCallback((): void => {
    // Reload to clear pending state
    window.location.reload();
  }, []);

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-999"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative z-1000"
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Close modal"
          type="button"
        >
          <XIcon size={20} className="text-gray-500 hover:text-gray-700" />
        </button>

        {/* Modal content based on auth state */}
        {uid ? (
          <SignedInView onClose={close} />
        ) : authPending ? (
          <AuthPending onReset={handlePendingReset} />
        ) : (
          <div className="w-full">
            {/* Tab navigation */}
            <div
              className="flex border-b border-gray-200 mb-6"
              role="tablist"
              aria-label="Authentication"
            >
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === "signin"
                    ? TAB_CLASSES.active
                    : TAB_CLASSES.inactive
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "signin"}
                aria-controls="auth-tabpanel"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === "signup"
                    ? TAB_CLASSES.active
                    : TAB_CLASSES.inactive
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "signup"}
                aria-controls="auth-tabpanel"
              >
                Sign Up
              </button>
            </div>

            {/* Social login */}
            <SocialLogin onSuccess={handleSuccess} />

            {/* Tab content */}
            <div id="auth-tabpanel" role="tabpanel">
              <AuthForm mode={activeTab} onSuccess={handleSuccess} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
