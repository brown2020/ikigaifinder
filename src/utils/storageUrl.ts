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
