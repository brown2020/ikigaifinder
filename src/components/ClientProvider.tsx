"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import CookieConsent from "react-cookie-consent";
import { useInitializeStores } from "@/zustand";
import ErrorBoundary from "./ErrorBoundary";
import useAuthToken from "@/hook/useAuthToken";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthToken(process.env.NEXT_PUBLIC_COOKIE_NAME!);
  useInitializeStores();

  useEffect(() => {
    function adjustHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    window.addEventListener("resize", adjustHeight);
    window.addEventListener("orientationchange", adjustHeight);

    // Initial adjustment
    adjustHeight();

    // Cleanup
    return () => {
      window.removeEventListener("resize", adjustHeight);
      window.removeEventListener("orientationchange", adjustHeight);
    };
  }, []);

  useEffect(() => {
    if (window.ReactNativeWebView) {
      document.body.classList.add("noscroll");
    } else {
      document.body.classList.remove("noscroll");
    }

    return () => {
      document.body.classList.remove("noscroll");
    };
  }, []);

  if (loading)
    return (
      <ErrorBoundary>
        <div
          className={`flex flex-col items-center justify-center h-full bg-[#333b51]`}
        >
          <ClipLoader color="#fff" size={80} />
        </div>
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        {children}
        {!window.ReactNativeWebView && (
          <CookieConsent>
            This app uses cookies to enhance the user experience.
          </CookieConsent>
        )}
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}
