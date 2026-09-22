"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LockIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthActions } from "@/hooks/use-auth-actions";
import SocialLogin from "@/components/auth/SocialLogin";
import { hasClientConfig } from "@/firebase/firebaseClient";
import { FooterLinks, PasswordField } from "./AuthPageBits";
import { sanitizeRedirect } from "./auth-page-utils";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirect(searchParams.get("redirect"));
  const { loginWithEmail, isLoading, error, clearError } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSuccess = useCallback(() => {
    // Hard-nav after session cookie sync so proxy sees the httpOnly cookie.
    window.location.assign(redirect);
  }, [redirect]);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      clearError();
      if (!hasClientConfig) {
        toast.error("Authentication is not configured.");
        return;
      }
      if (!email.trim() || !password) {
        toast.error("Please enter your email and password.");
        return;
      }
      await loginWithEmail(email.trim(), password, onSuccess);
    },
    [clearError, email, loginWithEmail, onSuccess, password]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Sign in</h1>
      <SocialLogin onSuccess={onSuccess} />
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200" role="alert">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError(); }}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoComplete="email"
          />
        </div>
        <PasswordField
          id="auth-password"
          value={password}
          onChange={(v) => { setPassword(v); clearError(); }}
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? "Loading..." : (<><LockIcon size={20} /> Sign in</>)}
        </button>
      </form>
      <div className="mt-6"><FooterLinks mode="login" /></div>
    </div>
  );
}
