import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalServerUid } from "@/lib/auth/session-server";
import { getIkigaiSummary } from "@/lib/ikigaiServer";
import DashboardPage from "./_components/dashboard-page";

export const metadata: Metadata = { title: "My ikigai" };

export default async function Dashboard() {
  const uid = await getOptionalServerUid();
  if (!uid) redirect("/login?redirect=/dashboard");

  const summary = await getIkigaiSummary(uid);
  return <DashboardPage userId={uid} initial={summary} />;
}
