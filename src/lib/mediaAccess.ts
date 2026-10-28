import { parseObjectPath } from "@/utils/storageUrl";

export interface CoverRecord {
  sharable: boolean;
  coverPath: string | null;
}

/**
 * Owner reads of their own objects, or a visitor read of the single cover that is currently public.
 * Profile photos stay owner-only. Sharing off fails this check.
 */
export async function canReadStoredObject(
  objectPath: string,
  viewerUid: string | null,
  loadCover: (uid: string) => Promise<CoverRecord>
): Promise<boolean> {
  const parsed = parseObjectPath(objectPath);
  if (!parsed) return false;
  if (viewerUid && viewerUid === parsed.uid) return true;
  if (parsed.area !== "generated") return false;
  const cover = await loadCover(parsed.uid);
  return cover.sharable && cover.coverPath === objectPath;
}
