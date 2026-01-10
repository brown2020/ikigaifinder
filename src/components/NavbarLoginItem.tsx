"use client";

import React from "react";
import { LogIn } from "lucide-react";
import { useUIStore } from "@/zustand";
import { Button } from "@/components/ui/Button";

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
    <Button
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
      variant="secondary"
      size="sm"
      leftIcon={<LogIn size={18} />}
      className="hover:bg-accent"
      type="button"
      aria-label="Sign in"
    >
      <span className="hidden sm:inline">Sign In</span>
    </Button>
  );
}
