import type { Metadata } from "next";
import PrivacyPage from "./_components/privacy-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicy() {
  return <PrivacyPage />;
}
