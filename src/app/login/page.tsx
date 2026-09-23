import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCardFallback, AuthPageShell } from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={<AuthCardFallback />}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
