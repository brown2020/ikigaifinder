import type { Metadata } from "next";
import TermsConditions from "./_components/terms-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return <TermsConditions />;
}
