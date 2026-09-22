"use client";

import React from "react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavbarLoginItem(): React.ReactElement {
  const pathname = usePathname();
  const redirect =
    pathname && pathname !== "/login" && pathname !== "/signup"
      ? `?redirect=${encodeURIComponent(pathname)}`
      : "";

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/login${redirect}`}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium border border-border hover:bg-accent transition-colors"
        aria-label="Sign in"
      >
        <LogIn size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
      <Link
        href={`/signup${redirect}`}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        aria-label="Create account"
      >
        <UserPlus size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Create account</span>
      </Link>
    </div>
  );
}
