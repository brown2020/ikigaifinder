import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import FooterNavBar from "@/components/FooterNavBar";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-gray-600">Loading…</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </section>
      <FooterNavBar />
    </>
  );
}
