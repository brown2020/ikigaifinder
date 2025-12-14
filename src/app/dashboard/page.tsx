import DashboardPage from "./_components/dashboard-page";
import { adminDb } from "@/firebase/firebaseAdmin";
import { getOptionalServerUid } from "@/lib/auth/session-server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const uid = await getOptionalServerUid();
  if (!uid) {
    redirect("/?redirect=/dashboard");
  }

  const docRef = adminDb
    .collection("ikigaiUsers")
    .doc(uid)
    .collection("ikigai")
    .doc("main");
  const docSnap = await docRef.get();
  const initialCoverImage = docSnap.exists
    ? (docSnap.data()?.ikigaiCoverImage as string | undefined) ?? null
    : null;

  return <DashboardPage userId={uid} initialCoverImage={initialCoverImage} />;
}
