"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";
import IkigaiLogo from "@/components/icons/IkigaiLogo";
import { ButtonLink, IconButton } from "@/components/ui/Button";
import { useUIStore } from "@/zustand";
import { selectAuthRedirectPath } from "@/zustand/useUIStore";
import { authLinkClasses } from "./AuthCard";

/**
 * Lightweight auth entry dialog. Email/password flows live on
 * /login, /signup, and /forgot-password.
 */
export default function AuthModal(): React.ReactElement | null {
  const isOpen = useUIStore((state) => state.isAuthModalOpen);
  const close = useUIStore((state) => state.closeAuthModal);
  const authRedirectPath = useUIStore(selectAuthRedirectPath);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const redirectQs =
    authRedirectPath && authRedirectPath.startsWith("/")
      ? `?redirect=${encodeURIComponent(authRedirectPath)}`
      : "";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[calc(100%-2.5rem)] max-w-md rounded-2xl border border-border bg-card p-8 text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm sm:p-10"
      onClose={close}
      aria-labelledby="auth-modal-title"
    >
      <IconButton
        variant="ghost"
        size="sm"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 text-muted-foreground"
        icon={<XIcon className="size-4" aria-hidden="true" />}
      />
      <div className="mb-8 flex flex-col items-center text-center">
        <IkigaiLogo className="mb-5 size-11 text-foreground" />
        <h2
          id="auth-modal-title"
          className="font-display text-3xl font-semibold tracking-tight"
        >
          Welcome to Ikigai Finder
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to save your progress and find your reason for being.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <ButtonLink href={`/login${redirectQs}`} onClick={close} size="lg" fullWidth>
          Sign in
        </ButtonLink>
        <ButtonLink
          href={`/signup${redirectQs}`}
          onClick={close}
          variant="neutral"
          size="lg"
          fullWidth
        >
          Create account
        </ButtonLink>
        <Link
          href="/forgot-password"
          onClick={close}
          className={`${authLinkClasses} mt-2 self-center text-sm`}
        >
          Forgot password?
        </Link>
      </div>
    </dialog>
  );
}
