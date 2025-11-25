"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/zustand";
import { ClipLoader } from "react-spinners";

// ============================================================================
// Types
// ============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, opens auth modal instead of redirecting */
  showModal?: boolean;
  /** Custom redirect path when not authenticated */
  redirectTo?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Protected Route Component
 * 
 * Wraps content that requires authentication.
 * Redirects unauthenticated users to the home page or opens auth modal.
 */
export default function ProtectedRoute({
  children,
  showModal = false,
  redirectTo = "/",
}: ProtectedRouteProps): React.ReactElement {
  const router = useRouter();
  const { uid, authReady } = useAuthStore();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for auth state to be determined
    if (!authReady) return;

    if (!uid) {
      if (showModal) {
        // Open auth modal instead of redirecting
        openAuthModal(typeof window !== "undefined" ? window.location.pathname : undefined);
      } else {
        // Redirect to home/login page
        router.push(redirectTo);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [authReady, uid, router, showModal, redirectTo, openAuthModal]);

  // Show loading while auth state is being determined
  if (!authReady || (!uid && !isAuthorized)) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen w-full bg-white"
        role="status"
        aria-label="Checking authentication"
      >
        <ClipLoader color="#333b51" size={50} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Render children if authorized
  return <>{children}</>;
}
