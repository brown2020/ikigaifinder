import type { IkigaiData } from "@/types";

export function normalizeStatement(text: string): string {
  return text
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isSameStatement(a: IkigaiData | null | undefined, b: IkigaiData | null | undefined): boolean {
  return Boolean(a && b && normalizeStatement(a.ikigai) === normalizeStatement(b.ikigai));
}

/** Appends statements not already present (compared case/punctuation-insensitively). */
export function mergeIkigaiLists(current: IkigaiData[], incoming: IkigaiData[]): IkigaiData[] {
  const seen = new Set(current.map((item) => normalizeStatement(item.ikigai)));
  const merged = [...current];
  for (const item of incoming) {
    const key = normalizeStatement(item.ikigai);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
}

/** Legacy statements may contain markdown bold markers from the old text format. */
export function displayStatement(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}
