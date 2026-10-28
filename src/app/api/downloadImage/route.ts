import { NextRequest } from "next/server";
import { serveStoredMedia } from "@/lib/serveMedia";
import { objectPathFromStored } from "@/utils/storageUrl";

export const dynamic = "force-dynamic";

/**
 * GET /api/downloadImage?url=
 * Downloads an object from this app's bucket. The URL is only a path hint:
 * the bytes are read with the Admin SDK after an ownership or public-cover check.
 */
export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get("url");
  if (!imageUrl) {
    return Response.json({ error: "URL parameter is required" }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
  const objectPath = objectPathFromStored(imageUrl, process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET);
  return serveStoredMedia(objectPath, true);
}
