import type { Metadata } from "next";
import ProfilePage from "./_components/profile-page";

export const metadata: Metadata = { title: "Profile" };

export default function Profile() {
  return <ProfilePage />;
}
