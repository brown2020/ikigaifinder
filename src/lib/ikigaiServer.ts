import "server-only";
import { cache } from "react";
import { adminDb } from "@/firebase/firebaseAdmin";
import { displayStatement } from "@/utils/ikigaiList";
import type { IkigaiSummary } from "@/types";


const EMPTY: IkigaiSummary = { coverImage: null, sharable: false, statement: null };

/** Reads the fields needed by the dashboard and public share page. Deduped per request. */
export const getIkigaiSummary = cache(async (uid: string): Promise<IkigaiSummary> => {
  if (!uid) return EMPTY;
  try {
    const snap = await adminDb.collection("ikigaiUsers").doc(uid).collection("ikigai").doc("main").get();
    if (!snap.exists) return EMPTY;
    const data = snap.data() ?? {};
    const selected = data.ikigaiSelected as { ikigai?: unknown } | null | undefined;
    return {
      coverImage: typeof data.ikigaiCoverImage === "string" && data.ikigaiCoverImage ? data.ikigaiCoverImage : null,
      sharable: data.ikigaiSharableUrl === true,
      statement: typeof selected?.ikigai === "string" ? displayStatement(selected.ikigai) : null,
    };
  } catch (error) {
    console.error("Failed to read ikigai summary:", error);
    return EMPTY;
  }
});

export function siteUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ikigaifinder.ai");
  } catch {
    return new URL("https://ikigaifinder.ai");
  }
}
