"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { useUIStore } from "@/zustand";
import { selectAuthRedirectPath } from "@/zustand/useUIStore";

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
      className="rounded-xl shadow-2xl p-8 w-full max-w-md backdrop:bg-black/40"
      onClose={close}
      aria-labelledby="auth-modal-title"
    >
      <button
        onClick={close}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Close modal"
        type="button"
      >
        <XIcon size={20} className="text-gray-500" />
      </button>
      <h2 id="auth-modal-title" className="text-xl font-semibold text-center mb-6">
        Welcome to Ikigai Finder
      </h2>
      <div className="flex flex-col gap-3">
        <Link
          href={`/login${redirectQs}`}
          onClick={close}
          className="w-full text-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sign in
        </Link>
        <Link
          href={`/signup${redirectQs}`}
          onClick={close}
          className="w-full text-center border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Create account
        </Link>
        <Link
          href="/forgot-password"
          onClick={close}
          className="text-center text-sm text-blue-600 underline"
        >
          Forgot password?
        </Link>
      </div>
    </dialog>
  );
}
