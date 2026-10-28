import "server-only";

import { NextResponse } from "next/server";
import { getOptionalServerUid } from "@/lib/auth/session-server";
import { getIkigaiSummary } from "@/lib/ikigaiServer";
import { canReadStoredObject } from "@/lib/mediaAccess";
import { readStoredObject } from "@/lib/mediaRead";
import { objectPathFromStored } from "@/utils/storageUrl";

const NO_STORE = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

/** Serves one stored object to its owner, or to anyone when it is the public cover. */
export async function serveStoredMedia(objectPath: string | null, download: boolean): Promise<NextResponse> {
  if (!objectPath) {
    return NextResponse.json({ error: "Image URL not allowed" }, { status: 403, headers: NO_STORE });
  }
  const viewerUid = await getOptionalServerUid();
  let allowed = false;
  try {
    allowed = await canReadStoredObject(objectPath, viewerUid, async (uid) => {
      const summary = await getIkigaiSummary(uid);
      return {
        sharable: summary.sharable,
        coverPath: summary.coverImage
          ? objectPathFromStored(summary.coverImage, process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET)
          : null,
      };
    });
  } catch (error) {
    console.error("Media authorization failed:", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: NO_STORE });
  }
  if (!allowed) {
    return NextResponse.json({ error: "Image URL not allowed" }, { status: 403, headers: NO_STORE });
  }
  const read = await readStoredObject(objectPath);
  if (!read.ok) {
    return NextResponse.json({ error: read.error }, { status: read.status, headers: NO_STORE });
  }
  return new NextResponse(new Uint8Array(read.body.bytes), {
    status: 200,
    headers: {
      ...NO_STORE,
      "Content-Type": read.body.contentType,
      ...(download ? { "Content-Disposition": 'attachment; filename="ikigai-image.png"' } : {}),
    },
  });
}
