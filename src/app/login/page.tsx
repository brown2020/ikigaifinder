import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import FooterNavBar from "@/components/FooterNavBar";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <>
      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-gray-600">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </section>
      <FooterNavBar />
    </>
  );
}
