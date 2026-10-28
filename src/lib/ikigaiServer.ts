import "server-only";
import { cache } from "react";
import { adminDb } from "@/firebase/firebaseAdmin";
import { displayStatement, shownStatement } from "@/utils/ikigaiList";
import { canonicalStoredImage } from "@/utils/mediaSrc";
import { IKIGAI_CIRCLES } from "@/constants/ikigai";
import type { IkigaiReport, IkigaiSummary } from "@/types";


const EMPTY: IkigaiSummary = { coverImage: null, sharable: false, statement: null, keywords: null };

function readKeywords(report: unknown, statement: unknown): IkigaiReport["keywords"] | null {
  const r = report as { statement?: unknown; keywords?: Record<string, unknown> } | null | undefined;
  if (!r?.keywords || typeof statement !== "string" || r.statement !== statement) return null;
  const entries = IKIGAI_CIRCLES.map((c) => {
    const list = r.keywords?.[c.id];
    return [c.id, Array.isArray(list) ? list.filter((w): w is string => typeof w === "string").slice(0, 3) : []];
  });
  return Object.fromEntries(entries) as IkigaiReport["keywords"];
}

/** Reads the fields needed by the dashboard and public share page. Deduped per request. */
export const getIkigaiSummary = cache(async (uid: string): Promise<IkigaiSummary> => {
  if (!uid) return EMPTY;
  try {
    const snap = await adminDb.collection("ikigaiUsers").doc(uid).collection("ikigai").doc("main").get();
    if (!snap.exists) return EMPTY;
    const data = snap.data() ?? {};
    const selected = data.ikigaiSelected as { ikigai?: unknown } | null | undefined;
    const storedCover = typeof data.ikigaiCoverImage === "string" ? data.ikigaiCoverImage : "";
    const coverImage = canonicalStoredImage(storedCover, process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET) || null;
    const raw = shownStatement(coverImage, data.ikigaiCardStatement, selected?.ikigai);
    return {
      coverImage,
      sharable: data.ikigaiSharableUrl === true,
      statement: raw ? displayStatement(raw) : null,
      keywords: readKeywords(data.ikigaiReport, raw),
    };
  } catch (error) {
    console.error("Failed to read ikigai summary:", error instanceof Error ? error.name : "unknown");
    throw new Error("Failed to read ikigai summary");
  }
});
