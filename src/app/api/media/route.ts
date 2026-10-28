import { NextRequest } from "next/server";
import { serveStoredMedia } from "@/lib/serveMedia";
import { parseObjectPath } from "@/utils/storageUrl";

export const dynamic = "force-dynamic";

/** GET /api/media?object=generated/{uid}/{file} */
export async function GET(request: NextRequest) {
  const objectPath = request.nextUrl.searchParams.get("object") ?? "";
  return serveStoredMedia(parseObjectPath(objectPath) ? objectPath : null, false);
}
