import React, { useState } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { signupWithEmail, sendMagicLink, isLoading, error, setError } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isMagicLink, setIsMagicLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMagicLink) {
      await sendMagicLink(email, name);
    } else {
      await signupWithEmail(email, password, name, onSuccess);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required={isMagicLink} 
        />
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {!isMagicLink && (
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setError("");
            }}
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Password should be at least 6 characters long</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            I accept the{" "}
            <Link href="/terms-conditions" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={isLoading || !email || (!isMagicLink && !password) || !acceptTerms}
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

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsMagicLink(!isMagicLink);
            setError("");
          }}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          {isMagicLink ? "Use Email/Password" : "Use Email Link"}
        </button>
      </div>
    </form>
  );
}


