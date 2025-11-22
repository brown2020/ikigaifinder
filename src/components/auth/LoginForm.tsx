import React, { useState } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { loginWithEmail, sendMagicLink, resetPassword, isLoading, error, setError } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only used for magic link
  const [isMagicLink, setIsMagicLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMagicLink) {
      await sendMagicLink(email, name);
    } else {
      await loginWithEmail(email, password, onSuccess);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}

      {isMagicLink && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setError("");
            }}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <div className="text-right mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              onClick={() => resetPassword(email)}
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={isLoading || !email || (!isMagicLink && !password)}
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


