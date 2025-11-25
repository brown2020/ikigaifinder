import type { IkigaiData } from "@/types";

// ============================================================================
// Constants
// ============================================================================

/**
 * Regex pattern to match structured ikigai output from AI
 * 
 * Matches format:
 * 1. <ikigai statement>
 *    - Passion & Profession: XX%
 *    - Profession & Vocation: XX%
 *    - Vocation & Mission: XX%
 *    - Passion & Mission: XX%
 *    - Overall Compatibility: XX%
 */
const IKIGAI_PATTERN =
  /(\d+)\.\s*(.*?)\n\s*-\s*Passion & Profession:\s*(\d+(?:\.\d+)?)%\s*-\s*Profession & Vocation:\s*(\d+(?:\.\d+)?)%\s*-\s*Vocation & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Passion & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Overall Compatibility:\s*(\d+(?:\.\d+)?)%/g;

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Extract ikigai data from AI-generated text
 * 
 * Parses the structured output format from the AI model
 * and converts it to an array of IkigaiData objects.
 * 
 * @param text - Raw text output from the AI model
 * @returns Array of parsed ikigai data objects
 */
export function extractIkigaiData(text: string): IkigaiData[] {
  if (!text) return [];

  const results: IkigaiData[] = [];
  let match: RegExpExecArray | null;

  // Reset regex lastIndex to ensure fresh matching
  IKIGAI_PATTERN.lastIndex = 0;

  while ((match = IKIGAI_PATTERN.exec(text)) !== null) {
    const [
      , // full match - unused
      , // index number - unused
      ikigaiStatement,
      passion,
      profession,
      vocation,
      mission,
      overall,
    ] = match;

    // Clean up the ikigai statement (remove markdown bold markers)
    const cleanStatement = ikigaiStatement
      .trim()
      .replace(/\*\*/g, "")
      .replace(/^\s*My Ikigai is to\s*/i, "My Ikigai is to ");

    results.push({
      ikigai: cleanStatement,
      Passion: parseFloat(passion),
      Profession: parseFloat(profession),
      Vocation: parseFloat(vocation),
      Mission: parseFloat(mission),
      OverallCompatibility: parseFloat(overall),
    });
  }

  return results;
}

/**
 * Merge two lists of ikigai data, removing duplicates
 * 
 * Uses the ikigai statement text as the unique identifier
 * to prevent duplicate entries.
 * 
 * @param currentList - Existing ikigai data
 * @param newList - New ikigai data to merge
 * @returns Merged list with duplicates removed
 */
export function mergeIkigaiLists(
  currentList: IkigaiData[],
  newList: IkigaiData[]
): IkigaiData[] {
  // Create a Set of existing ikigai statements for O(1) lookup
  const existingStatements = new Set(
    currentList.map((item) => normalizeIkigaiText(item.ikigai))
  );

  // Filter new items to only those that don't exist
  const uniqueNewItems = newList.filter(
    (item) => !existingStatements.has(normalizeIkigaiText(item.ikigai))
  );

  return [...currentList, ...uniqueNewItems];
}

/**
 * Normalize ikigai text for comparison
 * 
 * @param text - Ikigai statement text
 * @returns Normalized text for comparison
 */
function normalizeIkigaiText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
}

/**
 * Calculate the average compatibility score
 * 
 * @param data - Ikigai data object
 * @returns Average of all compatibility scores
 */
export function calculateAverageScore(data: IkigaiData): number {
  const scores = [
    data.Passion,
    data.Profession,
    data.Vocation,
    data.Mission,
    data.OverallCompatibility,
  ];

  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
}

/**
 * Sort ikigai data by overall compatibility (descending)
 * 
 * @param data - Array of ikigai data
 * @returns Sorted array (highest compatibility first)
 */
export function sortByCompatibility(data: IkigaiData[]): IkigaiData[] {
  return [...data].sort(
    (a, b) => b.OverallCompatibility - a.OverallCompatibility
  );
}
