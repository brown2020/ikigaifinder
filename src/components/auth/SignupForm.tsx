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

export function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirect(searchParams.get("redirect"));
  const { signupWithEmail, isLoading, error, clearError } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);

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
      if (!acceptTerms) {
        toast.error("Please accept the terms of service");
        return;
      }
      await signupWithEmail(email.trim(), password, name.trim(), onSuccess);
    },
    [acceptTerms, clearError, email, name, onSuccess, password, signupWithEmail]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Create account</h1>
      <SocialLogin onSuccess={onSuccess} />
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200" role="alert">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            id="auth-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError(); }}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="name"
          />
        </div>
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
          autoComplete="new-password"
          placeholder="Create a password"
        />
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
            <Link href="/terms-conditions" className="text-blue-600 underline" target="_blank">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-blue-600 underline" target="_blank">Privacy Policy</Link>
          </span>
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? "Loading..." : (<><LockIcon size={20} /> Create account</>)}
        </button>
      </form>
      <div className="mt-6"><FooterLinks mode="signup" /></div>
    </div>
  );
}
