"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LockIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthActions } from "@/hooks/use-auth-actions";
import SocialLogin from "@/components/auth/SocialLogin";
import { hasClientConfig } from "@/firebase/firebaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FooterLinks, PasswordField } from "./AuthPageBits";
import { AuthCard, AuthErrorAlert, authLinkClasses } from "./AuthCard";
import { sanitizeRedirect } from "./auth-page-utils";

export function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirect(searchParams.get("redirect"), "/ikigai-finder");
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
    <AuthCard
      title="Create your account"
      description="Save your answers, generate your ikigai, and share it."
      footer={<FooterLinks mode="signup" />}
    >
      <SocialLogin onSuccess={onSuccess} />
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <AuthErrorAlert message={error} />}
        <Input
          id="auth-name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); clearError(); }}
          placeholder="Your full name"
          autoComplete="name"
        />
        <Input
          id="auth-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError(); }}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <PasswordField
          id="auth-password"
          value={password}
          onChange={(v) => { setPassword(v); clearError(); }}
          autoComplete="new-password"
          placeholder="Create a password"
        />
        <div className="flex items-start gap-3">
          <input
            id="auth-accept-terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border-strong accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          />
          <label htmlFor="auth-accept-terms" className="cursor-pointer text-sm leading-relaxed text-muted-foreground">
            I accept the{" "}
            <Link href="/terms-conditions" className={authLinkClasses} target="_blank">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className={authLinkClasses} target="_blank">Privacy Policy</Link>
          </label>
        </div>
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          loadingText="Creating account…"
          leftIcon={<LockIcon className="size-4" aria-hidden="true" />}
        >
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
