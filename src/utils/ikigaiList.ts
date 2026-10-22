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

/**
 * Puts statements not already present (compared case/punctuation-insensitively)
 * ahead of the current list, so the newest batch is the first thing people see.
 */
export function mergeIkigaiLists(current: IkigaiData[], incoming: IkigaiData[]): IkigaiData[] {
  const seen = new Set(current.map((item) => normalizeStatement(item.ikigai)));
  const added: IkigaiData[] = [];
  for (const item of incoming) {
    const key = normalizeStatement(item.ikigai);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    added.push(item);
  }
  return [...added, ...current];
}

/** The statement a visitor should read: the one baked into the card image when there is one, else the current choice. */
export function shownStatement(coverImage: string | null, cardStatement: unknown, selected: unknown): string | null {
  if (coverImage && typeof cardStatement === "string" && cardStatement) return cardStatement;
  return typeof selected === "string" && selected ? selected : null;
}

/** How many already-shown statements the model is asked not to repeat. Must stay within `generateIkigaiSchema`'s `existing` limit. */
export const AVOID_LIST_LIMIT = 20;

/** The newest statements to send as "avoid these"; older repeats are still dropped by `mergeIkigaiLists`. */
export function recentStatements(list: IkigaiData[]): string[] {
  return list.slice(0, AVOID_LIST_LIMIT).map((item) => item.ikigai);
}

/** Legacy statements may contain markdown bold markers from the old text format. */
export function displayStatement(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}
