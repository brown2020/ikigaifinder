"use client";

import React, { useState, useCallback } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useAuthActions } from "@/hooks/use-auth-actions";
import toast from "react-hot-toast";

// ============================================================================
// Types
// ============================================================================

type AuthMode = "signin" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  onSuccess: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Unified Auth Form Component
 *
 * Handles both sign-in and sign-up flows with support for:
 * - Email/password authentication
 * - Magic link (passwordless) authentication
 * - Password reset (sign-in mode only)
 * - Terms of service acceptance (sign-up mode only)
 */
export default function AuthForm({
  mode,
  onSuccess,
}: AuthFormProps): React.ReactElement {
  const isSignup = mode === "signup";

  const {
    loginWithEmail,
    signupWithEmail,
    sendMagicLink,
    resetPassword,
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

      if (isSignup && !acceptTerms) {
        toast.error("Please accept the terms of service");
        return;
      }

      if (isMagicLink) {
        const success = await sendMagicLink(email, name);
        if (success) {
          toast.success(
            `Check your email for the ${isSignup ? "sign-up" : "sign-in"} link!`
          );
        }
      } else if (isSignup) {
        await signupWithEmail(email, password, name, onSuccess);
      } else {
        await loginWithEmail(email, password, onSuccess);
      }
    },
    [
      email,
      password,
      name,
      acceptTerms,
      isMagicLink,
      isSignup,
      loginWithEmail,
      signupWithEmail,
      sendMagicLink,
      onSuccess,
    ]
  );

  /**
   * Handle password reset
   */
  const handleResetPassword = useCallback(async (): Promise<void> => {
    const success = await resetPassword(email);
    if (success) {
      toast.success(`Password reset email sent to ${email}`);
    }
  }, [email, resetPassword]);

  /**
   * Handle input changes with error clearing
   */
  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (event: React.ChangeEvent<HTMLInputElement>): void => {
        setter(event.target.value);
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
    isLoading ||
    !email ||
    (!isMagicLink && !password) ||
    (isSignup && !acceptTerms);

  const showNameField = isSignup || isMagicLink;

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
      {showNameField && (
        <div>
          <label
            htmlFor={`${mode}-name`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name {(isSignup || isMagicLink) && "*"}
          </label>
          <input
            id={`${mode}-name`}
            type="text"
            value={name}
            onChange={handleInputChange(setName)}
            placeholder={isSignup ? "Enter your full name" : "Enter your name"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={isSignup || isMagicLink}
            autoComplete="name"
          />
        </div>
      )}

      {/* Email field */}
      <div>
        <label
          htmlFor={`${mode}-email`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email {isSignup && "*"}
        </label>
        <input
          id={`${mode}-email`}
          type="email"
          value={email}
          onChange={handleInputChange(setEmail)}
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
            htmlFor={`${mode}-password`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password {isSignup && "*"}
          </label>
          <input
            id={`${mode}-password`}
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            placeholder={isSignup ? "Create a password" : "Enter your password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={isSignup ? 6 : undefined}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
          {isSignup && (
            <p className="text-xs text-gray-500 mt-1">
              Password should be at least 6 characters long
            </p>
          )}
          {!isSignup && (
            <div className="text-right mt-2">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
      )}

      {/* Terms acceptance (signup only) */}
      {isSignup && (
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
      )}

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
            <MailIcon size={20} /> Send {isSignup ? "Sign-Up" : "Sign-In"} Link
          </>
        ) : (
          <>
            <LockIcon size={20} /> {isSignup ? "Create Account" : "Sign In"}
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
