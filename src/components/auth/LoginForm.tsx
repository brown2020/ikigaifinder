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
import { cn } from "@/utils/cn";
import { FooterLinks, PasswordField } from "./AuthPageBits";
import { AuthCard, AuthErrorAlert, authLinkClasses } from "./AuthCard";
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
    <AuthCard
      title="Welcome back"
      description="Sign in to continue your ikigai journey."
      footer={<FooterLinks mode="login" />}
    >
      <SocialLogin onSuccess={onSuccess} />
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <AuthErrorAlert message={error} />}
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
        <div className="space-y-2">
          <PasswordField
            id="auth-password"
            value={password}
            onChange={(v) => { setPassword(v); clearError(); }}
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          <div className="text-right">
            <Link href="/forgot-password" className={cn(authLinkClasses, "text-sm")}>
              Forgot password?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          loadingText="Signing in…"
          leftIcon={<LockIcon className="size-4" aria-hidden="true" />}
        >
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
