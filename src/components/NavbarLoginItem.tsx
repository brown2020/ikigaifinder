"use client";

import React from "react";
import { LogIn } from "lucide-react";
import { useUIStore } from "@/zustand";

// ============================================================================
// Component
// ============================================================================

/**
 * Navbar Login Item Component
 *
 * Renders a sign-in button in the navbar for unauthenticated users
 */
export default function NavbarLoginItem(): React.ReactElement {
  const openAuthModal = useUIStore((state) => state.openAuthModal);

  return (
    <button
      onClick={() => {
        const url = new URL(window.location.href);
        const redirectParam = url.searchParams.get("redirect");
        const redirectPath =
          redirectParam &&
          redirectParam.startsWith("/") &&
          !redirectParam.startsWith("//") &&
          !redirectParam.includes("://")
            ? redirectParam
            : window.location.pathname;

        openAuthModal(redirectPath);
      }}
      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
      type="button"
      aria-label="Sign in"
    >
      <LogIn size={20} />
      <span className="hidden sm:inline">Sign In</span>
    </button>
  );
}
