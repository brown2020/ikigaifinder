import { mediaUrlForPath, objectPathFromStored } from "@/utils/storageUrl";

const GOOGLE_AVATAR_HOST = "lh3.googleusercontent.com";

export interface DisplaySrc {
  src: string;
  /** Static files may go through next/image. Everything else is a plain img. */
  optimized: boolean;
}

/** A src that is safe to put in the DOM. Bucket URLs become same-origin media URLs. */
export function resolveDisplaySrc(raw: string | null | undefined, bucket: string | undefined): DisplaySrc | null {
  if (!raw) return null;
  if (raw.startsWith("/assets/") && !raw.includes("\\") && !raw.includes("..")) {
    return { src: raw, optimized: true };
  }
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\")) {
    const path = objectPathFromStored(raw, bucket);
    if (raw.startsWith("/api/media") && path) return { src: mediaUrlForPath(path), optimized: false };
    return null;
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.hostname === GOOGLE_AVATAR_HOST && url.username === "" && url.password === "") {
    return { src: url.href, optimized: false };
  }
  const path = objectPathFromStored(raw, bucket);
  return path ? { src: mediaUrlForPath(path), optimized: false } : null;
}

/** Value persisted for a generated or uploaded image. Drops bearer URLs and unknown hosts. */
export function canonicalStoredImage(raw: string | undefined, bucket: string | undefined): string {
  if (!raw) return "";
  const path = objectPathFromStored(raw, bucket);
  return path ? mediaUrlForPath(path) : "";
}
