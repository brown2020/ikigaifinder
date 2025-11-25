"use client";

import React, { useState, useCallback } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useAuthActions } from "@/hooks/use-auth-actions";
import toast from "react-hot-toast";

// ============================================================================
// Types
// ============================================================================

interface SignupFormProps {
  onSuccess: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Signup Form Component
 * 
 * Supports:
 * - Email/password registration
 * - Magic link (passwordless) registration
 * - Terms of service acceptance
 */
export default function SignupForm({ onSuccess }: SignupFormProps): React.ReactElement {
  const {
    signupWithEmail,
    sendMagicLink,
    isLoading,
    error,
    clearError,
  } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isMagicLink, setIsMagicLink] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event: React.FormEvent): Promise<void> => {
      event.preventDefault();

      if (!acceptTerms) {
        toast.error("Please accept the terms of service");
        return;
      }

      if (isMagicLink) {
        const success = await sendMagicLink(email, name);
        if (success) {
          toast.success("Check your email for the sign-up link!");
        }
      } else {
        await signupWithEmail(email, password, name, onSuccess);
      }
    },
    [email, password, name, acceptTerms, isMagicLink, signupWithEmail, sendMagicLink, onSuccess]
  );

  /**
   * Handle email change
   */
  const handleEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setEmail(event.target.value);
      clearError();
    },
    [clearError]
  );

  /**
   * Handle password change
   */
  const handlePasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setPassword(event.target.value);
      clearError();
    },
    [clearError]
  );

  /**
   * Toggle between email/password and magic link
   */
  const toggleMagicLink = useCallback((): void => {
    setIsMagicLink((prev) => !prev);
    clearError();
  }, [clearError]);

  const isSubmitDisabled =
    isLoading || !email || (!isMagicLink && !password) || !acceptTerms;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message */}
      {error && (
        <div
          className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Name field */}
      <div>
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name {isMagicLink && "*"}
        </label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required={isMagicLink}
          autoComplete="name"
        />
      </div>

      {/* Email field */}
      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email *
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          autoComplete="email"
        />
      </div>

      {/* Password field (email/password only) */}
      {!isMagicLink && (
        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password *
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password should be at least 6 characters long
          </p>
        </div>
      )}

      {/* Terms acceptance */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            I accept the{" "}
            <Link
              href="/terms-conditions"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={isSubmitDisabled}
      >
        {isLoading ? (
          "Loading..."
        ) : isMagicLink ? (
          <>
            <MailIcon size={20} /> Send Sign-Up Link
          </>
        ) : (
          <>
            <LockIcon size={20} /> Create Account
          </>
        )}
      </button>

      {/* Toggle magic link */}
      <div className="text-center">
        <button
          type="button"
          onClick={toggleMagicLink}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          {isMagicLink ? "Use Email/Password" : "Use Email Link"}
        </button>
      </div>
    </form>
  );
}
