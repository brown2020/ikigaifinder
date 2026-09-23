"use client";

import { useCallback, useState } from "react";
import { MailCheck, MailIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { hasClientConfig } from "@/firebase/firebaseClient";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FooterLinks } from "./AuthPageBits";
import { AuthCard, AuthErrorAlert } from "./AuthCard";

export function ForgotPasswordForm() {
  const { resetPassword, isLoading, error, clearError } = useAuthActions();
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      clearError();
      if (!hasClientConfig) {
        toast.error("Authentication is not configured.");
        return;
      }
      if (!email.trim()) {
        toast.error("Please enter your email address.");
        return;
      }
      const ok = await resetPassword(email.trim());
      if (ok) {
        setResetSent(true);
        toast.success(`Password reset email sent to ${email.trim()}`);
      }
    },
    [clearError, email, resetPassword]
  );

  return (
    <AuthCard
      title={resetSent ? "Check your inbox" : "Reset your password"}
      description={
        resetSent
          ? "We sent a reset link to your email. Follow it, then come back to sign in."
          : "Enter the email you signed up with and we'll send you a reset link."
      }
      footer={<FooterLinks mode="forgot" />}
    >
      {resetSent ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MailCheck className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground" role="status">
            Didn&apos;t get it? Check your spam folder or try again in a few minutes.
          </p>
          <ButtonLink href="/login" fullWidth size="lg">
            Back to sign in
          </ButtonLink>
        </div>
      ) : (
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
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            loadingText="Sending…"
            leftIcon={<MailIcon className="size-4" aria-hidden="true" />}
          >
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
