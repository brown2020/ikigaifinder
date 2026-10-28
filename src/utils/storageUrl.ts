const OBJECT_PATH = /^(generated|users)\/([A-Za-z0-9]{1,128})\/([^/]+)$/;
const FILE_NAME = /^[A-Za-z0-9._:-]{1,200}$/;

export interface StoredObjectPath {
  uid: string;
  area: "generated" | "users";
  file: string;
}

/** Owner-scoped object path, or null when it could escape that prefix. */
export function parseObjectPath(path: string): StoredObjectPath | null {
  const match = OBJECT_PATH.exec(path);
  if (!match) return null;
  const file = match[3];
  if (file === "." || file === ".." || file.includes("..") || file.includes("\\") || !FILE_NAME.test(file)) return null;
  return { uid: match[2], area: match[1] as StoredObjectPath["area"], file };
}

/** Same-origin URL the media route can authorize. Never a storage bearer token. */
export function mediaUrlForPath(path: string): string {
  return `/api/media?object=${encodeURIComponent(path)}`;
}

/**
 * Object path from a raw path, an app media URL, or a URL in this bucket.
 * Returns null for any other host so callers do not pass it through.
 */
export function objectPathFromStored(raw: string, bucket: string | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("/api/media?") || raw.startsWith("/api/media#")) {
    try {
      const objectPath = new URL(raw, "https://ikigaifinder.invalid").searchParams.get("object") ?? "";
      return parseObjectPath(objectPath) ? objectPath : null;
    } catch {
      return null;
    }
  }
  if (!raw.includes("://")) return parseObjectPath(raw) ? raw : null;
  if (!bucket || !isOwnBucketUrl(raw, bucket)) return null;
  const url = new URL(raw);
  let encoded = "";
  if (url.hostname === "firebasestorage.googleapis.com") {
    encoded = url.pathname.slice(`/v0/b/${bucket}/o/`.length);
  } else if (url.hostname === "storage.googleapis.com") {
    encoded = url.pathname.slice(`/${bucket}/`.length);
  } else {
    encoded = url.pathname.replace(/^\//, "");
  }
  let decoded: string;
  try {
    decoded = decodeURIComponent(encoded);
  } catch {
    return null;
  }
  return parseObjectPath(decoded) ? decoded : null;
}

/**
 * True only for objects in this app's own Storage bucket, in the URL shapes the app produces:
 * Firebase download URLs (card uploads) and Cloud Storage signed URLs (generated backgrounds).
 */
export function isOwnBucketUrl(raw: string, bucket: string | undefined): boolean {
  if (!bucket) return false;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  if (url.hostname === "firebasestorage.googleapis.com") return url.pathname.startsWith(`/v0/b/${bucket}/o/`);
  if (url.hostname === "storage.googleapis.com") return url.pathname.startsWith(`/${bucket}/`);
  return url.hostname === `${bucket}.storage.googleapis.com`;
}
