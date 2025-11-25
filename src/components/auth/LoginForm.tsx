"use client";

import React, { useState, useCallback } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import { useAuthActions } from "@/hooks/use-auth-actions";
import toast from "react-hot-toast";

// ============================================================================
// Types
// ============================================================================

interface LoginFormProps {
  onSuccess: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Login Form Component
 * 
 * Supports:
 * - Email/password authentication
 * - Magic link (passwordless) authentication
 * - Password reset
 */
export default function LoginForm({ onSuccess }: LoginFormProps): React.ReactElement {
  const {
    loginWithEmail,
    sendMagicLink,
    resetPassword,
    isLoading,
    error,
    clearError,
  } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isMagicLink, setIsMagicLink] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event: React.FormEvent): Promise<void> => {
      event.preventDefault();

      if (isMagicLink) {
        const success = await sendMagicLink(email, name);
        if (success) {
          toast.success("Check your email for the sign-in link!");
        }
      } else {
        await loginWithEmail(email, password, onSuccess);
      }
    },
    [email, password, name, isMagicLink, loginWithEmail, sendMagicLink, onSuccess]
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

  const isSubmitDisabled = isLoading || !email || (!isMagicLink && !password);

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

      {/* Name field (magic link only) */}
      {isMagicLink && (
        <div>
          <label
            htmlFor="login-name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name
          </label>
          <input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="name"
          />
        </div>
      )}

      {/* Email field */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          id="login-email"
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
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoComplete="current-password"
          />
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
            <MailIcon size={20} /> Send Sign-In Link
          </>
        ) : (
          <>
            <LockIcon size={20} /> Sign In
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
