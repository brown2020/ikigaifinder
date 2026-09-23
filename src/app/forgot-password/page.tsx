import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthCardFallback, AuthPageShell } from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={<AuthCardFallback />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}
