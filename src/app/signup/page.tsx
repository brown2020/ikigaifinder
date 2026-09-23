import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthCardFallback, AuthPageShell } from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={<AuthCardFallback />}>
        <SignupForm />
      </Suspense>
    </AuthPageShell>
  );
}
