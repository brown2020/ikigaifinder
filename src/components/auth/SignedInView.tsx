"use client";

import React, { useCallback } from "react";
import { useAuthStore } from "@/zustand";
import { useAuthActions } from "@/hooks/use-auth-actions";

// ============================================================================
// Types
// ============================================================================

interface SignedInViewProps {
  onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Signed In View Component
 * 
 * Displayed in the auth modal when a user is already signed in
 * Shows user info and sign out option
 */
export default function SignedInView({ onClose }: SignedInViewProps): React.ReactElement {
  const { authDisplayName, authEmail } = useAuthStore();
  const { signOut, isLoading } = useAuthActions();

  /**
   * Handle sign out
   */
  const handleSignOut = useCallback((): void => {
    signOut(onClose);
  }, [signOut, onClose]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-center font-semibold text-gray-900">
        You are signed in
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div>
          <div className="text-sm text-gray-500">Display Name</div>
          <div className="font-medium text-gray-900">
            {authDisplayName || "User"}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-medium text-gray-900">{authEmail}</div>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          type="button"
        >
          Close
        </button>
        <button
          onClick={handleSignOut}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
          type="button"
          disabled={isLoading}
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
