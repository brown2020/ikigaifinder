"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LockIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthActions } from "@/hooks/use-auth-actions";
import SocialLogin from "@/components/auth/SocialLogin";
import { hasClientConfig } from "@/firebase/firebaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConsentNote, FooterLinks, PasswordField } from "./AuthPageBits";
import { AuthCard, AuthErrorAlert } from "./AuthCard";
import { sanitizeRedirect } from "./auth-page-utils";

export function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirect(searchParams.get("redirect"), "/ikigai-finder");
  const { signupWithEmail, isLoading, error, clearError } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

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
      await signupWithEmail(email.trim(), password, name.trim(), onSuccess);
    },
    [clearError, email, name, onSuccess, password, signupWithEmail]
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
        <ConsentNote />
      </form>
    </AuthCard>
  );
}
