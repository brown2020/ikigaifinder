"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import type { AuthPageMode } from "./auth-page-utils";

export function PasswordField({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <div className="relative">
        <input
          id={id}
          name="password"
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          minLength={autoComplete === "new-password" ? 6 : undefined}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-600 hover:bg-gray-100"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

export function FooterLinks({ mode }: { mode: AuthPageMode }) {
  if (mode === "login") {
    return (
      <p className="text-sm text-center text-gray-600">
        No account?{" "}
        <Link href="/signup" className="text-blue-600 underline">
          Create account
        </Link>
      </p>
    );
  }
  if (mode === "signup") {
    return (
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 underline">
          Sign in
        </Link>
      </p>
    );
  }
  return (
    <p className="text-sm text-center text-gray-600">
      Remembered it?{" "}
      <Link href="/login" className="text-blue-600 underline">
        Back to sign in
      </Link>
    </p>
  );
}
