"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import CookieConsent from "react-cookie-consent";
import { useInitializeStores } from "@/zustand";
import { useAuthToken } from "@/hooks/use-auth-token";
import { hasClientConfig } from "@/firebase/firebaseClient";
import { isReactNativeWebView } from "@/utils/platform";
import ErrorBoundary from "./ErrorBoundary";

const AuthModal = dynamic(() => import("@/components/auth/AuthModal"), {
  ssr: false,
});

const noopSubscribe = () => () => {};

function AuthBootstrap(): null {
  useAuthToken();
  useInitializeStores();
  return null;
}

export function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const isRNWebView = useSyncExternalStore(noopSubscribe, isReactNativeWebView, () => false);

  return (
    <ErrorBoundary>
      {hasClientConfig ? <AuthBootstrap /> : null}
      {children}

      {!isRNWebView && (
        <div role="region" aria-label="Cookie consent">
          <CookieConsent
            buttonText="Got it"
            cookieName="ikigai-cookie-consent"
            expires={365}
            disableStyles
            containerClasses="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-foreground shadow-lg sm:bottom-6"
            buttonClasses="shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            contentClasses="text-muted-foreground"
          >
            We use cookies to keep you signed in and improve the experience.
          </CookieConsent>
        </div>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f1a17",
            color: "#faf7f2",
            borderRadius: "9999px",
            fontSize: "14px",
            padding: "10px 16px",
          },
          success: { iconTheme: { primary: "#2f8a6d", secondary: "#faf7f2" } },
          error: { iconTheme: { primary: "#e8836b", secondary: "#1f1a17" } },
        }}
      />

      <AuthModal />
    </ErrorBoundary>
  );
}

export default ClientProvider;
