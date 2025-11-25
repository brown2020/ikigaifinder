"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthActions } from "@/hooks/use-auth-actions";

// ============================================================================
// Types
// ============================================================================

interface SocialLoginProps {
  onSuccess: () => void;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Check if running in iOS React Native WebView
 * (Google Sign-In is blocked in iOS WebViews)
 */
function isIOSReactNativeWebView(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.ReactNativeWebView !== "undefined";
}

// ============================================================================
// Component
// ============================================================================

/**
 * Social Login Component
 * 
 * Renders social login options (currently Google only)
 * Automatically hides in iOS WebViews where Google Sign-In isn't supported
 */
export default function SocialLogin({ onSuccess }: SocialLoginProps): React.ReactElement | null {
  const { signInWithGoogle, isLoading } = useAuthActions();
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

  // Determine if Google Sign-In should be shown (client-side only)
  useEffect(() => {
    setShowGoogleSignIn(!isIOSReactNativeWebView());
  }, []);

  // Don't render if Google Sign-In isn't available
  if (!showGoogleSignIn) return null;

  return (
    <>
      <button
        type="button"
        className="w-full mb-4 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => signInWithGoogle(onSuccess)}
        disabled={isLoading}
        aria-label="Continue with Google"
      >
        <Image
          src="/assets/google_ctn.svg"
          alt="Continue with Google"
          className="w-full h-auto"
          width={189}
          height={40}
          priority
        />
      </button>

      {/* Divider */}
      <div className="flex items-center justify-center w-full mb-6">
        <hr className="flex-1 h-px bg-gray-300 border-0" aria-hidden="true" />
        <span className="px-4 text-gray-500 text-sm">or</span>
        <hr className="flex-1 h-px bg-gray-300 border-0" aria-hidden="true" />
      </div>
    </>
  );
}
