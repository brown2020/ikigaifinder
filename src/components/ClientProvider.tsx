"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import CookieConsent from "react-cookie-consent";
import { useInitializeStores } from "@/zustand";
import { useAuthToken } from "@/hooks/use-auth-token";
import { isReactNativeWebView } from "@/utils/platform";
import ErrorBoundary from "./ErrorBoundary";

// Lazy load auth modal for better initial load (it's conditionally rendered)
const AuthModal = dynamic(() => import("@/components/auth/AuthModal"), {
  ssr: false,
});

// ============================================================================
// Types
// ============================================================================

interface ClientProviderProps {
  children: React.ReactNode;
}

// ============================================================================
// Viewport Height Hook
// ============================================================================

/**
 * Custom hook to handle dynamic viewport height for mobile browsers
 * Sets a CSS variable --vh that can be used instead of vh units
 */
function useViewportHeight(): void {
  useEffect(() => {
    function adjustHeight(): void {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    // Initial adjustment
    adjustHeight();

    // Listen for resize and orientation changes
    window.addEventListener("resize", adjustHeight);
    window.addEventListener("orientationchange", adjustHeight);

    return () => {
      window.removeEventListener("resize", adjustHeight);
      window.removeEventListener("orientationchange", adjustHeight);
    };
  }, []);
}

// ============================================================================
// React Native WebView Hook
// ============================================================================

/**
 * Custom hook to handle React Native WebView specific styling
 */
function useReactNativeWebView(): boolean {
  const [isRNWebView, setIsRNWebView] = useState(false);

  useEffect(() => {
    const isWebView = isReactNativeWebView();
    setIsRNWebView(isWebView);

    if (isWebView) {
      document.body.classList.add("noscroll");
    }

    return () => {
      document.body.classList.remove("noscroll");
    };
  }, []);

  return isRNWebView;
}

// ============================================================================
// Client Provider Component
// ============================================================================

/**
 * Client-side provider component that wraps the application
 *
 * Handles:
 * - Authentication state initialization
 * - Store hydration
 * - Viewport height adjustments
 * - React Native WebView compatibility
 * - Cookie consent
 * - Toast notifications
 */
export function ClientProvider({
  children,
}: ClientProviderProps): React.ReactElement {
  // Initializes the Firebase auth listener and server session cookie in the background.
  useAuthToken();
  const isRNWebView = useReactNativeWebView();

  // Initialize stores after auth is ready
  useInitializeStores();

  // Handle viewport height for mobile browsers
  useViewportHeight();

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        {children}

        {/* Cookie consent - hide in React Native WebView */}
        {!isRNWebView && (
          <CookieConsent
            buttonText="Accept"
            cookieName="ikigai-cookie-consent"
            style={{ background: "#2B373B" }}
            buttonStyle={{
              color: "#4e503b",
              fontSize: "13px",
              background: "#fff",
              borderRadius: "4px",
              padding: "8px 16px",
            }}
            expires={365}
          >
            This app uses cookies to enhance the user experience.
          </CookieConsent>
        )}

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#fff",
              },
            },
          }}
        />

        {/* Auth modal - rendered at root level for proper z-index */}
        <AuthModal />
      </div>
    </ErrorBoundary>
  );
}

export default ClientProvider;
