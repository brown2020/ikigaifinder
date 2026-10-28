import "server-only";

import { adminBucket } from "@/firebase/firebaseAdmin";
import { allowedImageType, MAX_MEDIA_BYTES, readBounded } from "@/lib/mediaBytes";

export interface MediaBody {
  bytes: Buffer;
  contentType: string;
}

export type MediaReadResult = { ok: true; body: MediaBody } | { ok: false; status: number; error: string };

interface ReadableFile {
  getMetadata(): Promise<[{ size?: string | number; contentType?: string }]>;
  createReadStream(): AsyncIterable<Uint8Array> & { destroy?: () => void };
}

/** Downloads one object, refusing types and sizes the product does not serve. */
export async function readStoredObject(
  objectPath: string,
  bucket: { file(path: string): ReadableFile } = adminBucket as unknown as { file(path: string): ReadableFile }
): Promise<MediaReadResult> {
  const file = bucket.file(objectPath);
  let metadata: { size?: string | number; contentType?: string };
  try {
    [metadata] = await file.getMetadata();
  } catch (error) {
    const code = (error as { code?: unknown } | null)?.code;
    if (code === 404 || code === "404") return { ok: false, status: 404, error: "Image not found" };
    console.error("Media metadata read failed:", error instanceof Error ? error.name : "unknown");
    return { ok: false, status: 500, error: "Internal server error" };
  }
  const contentType = allowedImageType(metadata.contentType);
  if (!contentType) return { ok: false, status: 415, error: "URL does not point to an image" };
  const declared = Number(metadata.size ?? 0);
  if (Number.isFinite(declared) && declared > MAX_MEDIA_BYTES) {
    return { ok: false, status: 413, error: "Image file too large" };
  }
  const stream = file.createReadStream();
  try {
    const bytes = await readBounded(stream, MAX_MEDIA_BYTES);
    if (!bytes) {
      stream.destroy?.();
      return { ok: false, status: 413, error: "Image file too large" };
    }
    return { ok: true, body: { bytes, contentType } };
  } catch (error) {
    stream.destroy?.();
    console.error("Media download failed:", error instanceof Error ? error.name : "unknown");
    return { ok: false, status: 500, error: "Internal server error" };
  }
}
