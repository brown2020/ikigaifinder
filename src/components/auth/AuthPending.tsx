"use client";

import React, { useCallback } from "react";
import { PulseLoader } from "react-spinners";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { useAuthStore } from "@/zustand";

// ============================================================================
// Types
// ============================================================================

interface AuthPendingProps {
  onReset: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Auth Pending Component
 * 
 * Displayed when a magic link sign-in is pending
 * Shows instructions and options to try different methods
 */
export default function AuthPending({ onReset }: AuthPendingProps): React.ReactElement {
  const { signOut } = useAuthActions();
  const { authEmail } = useAuthStore();

  /**
   * Handle trying a different authentication method
   */
  const handleTryDifferentMethod = useCallback((): void => {
    onReset();
  }, [onReset]);

  /**
   * Handle starting over (sign out)
   */
  const handleStartOver = useCallback((): void => {
    signOut(onReset);
  }, [signOut, onReset]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl text-center text-gray-900 font-semibold">
        Signing you in
      </h2>

      <div className="flex flex-col gap-3 border rounded-md px-4 py-3 bg-gray-50 mt-4">
        <p className="text-gray-700">
          Check your email at <strong>{authEmail}</strong> for a message from Ikigai
          Finder.
        </p>

        <p className="text-gray-700">
          If you don&apos;t see the message, check your spam folder. Mark it
          &quot;not spam&quot; or move it to your inbox.
        </p>

        <p className="text-gray-700">
          Click the sign-in link in the message to complete the sign-in process.
        </p>

        <div className="text-gray-700 flex items-center gap-2">
          <span>Waiting for you to click the sign-in link</span>
          <PulseLoader color="#374151" size={6} />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleTryDifferentMethod}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          type="button"
        >
          Try Different Method
        </button>
        <button
          onClick={handleStartOver}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          type="button"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
