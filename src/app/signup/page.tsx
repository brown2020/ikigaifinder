import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import FooterNavBar from "@/components/FooterNavBar";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <>
      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-gray-600">Loading…</div>}>
          <SignupForm />
        </Suspense>
      </section>
      <FooterNavBar />
    </>
  );
}
