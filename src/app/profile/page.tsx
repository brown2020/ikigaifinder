import type { Metadata } from "next";
import { requirePageSession } from "@/lib/auth/requirePage";
import ProfilePage from "./_components/profile-page";

export const metadata: Metadata = { title: "Profile" };

export default async function Profile() {
  await requirePageSession("/profile");
  return <ProfilePage />;
}
