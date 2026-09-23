"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { AuthPageMode } from "./auth-page-utils";
import { authLinkClasses } from "./AuthCard";

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
  const isNew = autoComplete === "new-password";
  return (
    <Input
      id={id}
      name="password"
      label="Password"
      type={show ? "text" : "password"}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      minLength={isNew ? 6 : undefined}
      helperText={isNew ? "At least 6 characters." : undefined}
      rightIcon={
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          onClick={() => setShow((v) => !v)}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}

export function FooterLinks({ mode }: { mode: AuthPageMode }) {
  if (mode === "login") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        New to Ikigai Finder?{" "}
        <Link href="/signup" className={authLinkClasses}>
          Create an account
        </Link>
      </p>
    );
  }
  if (mode === "signup") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className={authLinkClasses}>
          Sign in
        </Link>
      </p>
    );
  }
  return (
    <p className="text-center text-sm text-muted-foreground">
      Remembered it?{" "}
      <Link href="/login" className={authLinkClasses}>
        Back to sign in
      </Link>
    </p>
  );
}
