import type { IkigaiScores } from "@/types";

export type CircleId = "love" | "skill" | "world" | "paid";

export interface IkigaiCircle {
  id: CircleId;
  /** Matches the questionnaire section id persisted in Firestore. */
  stepId: "passion" | "profession" | "mission" | "vocation";
  label: string;
  short: string;
  color: string;
}

export const IKIGAI_CIRCLES: readonly IkigaiCircle[] = [
  { id: "love", stepId: "passion", label: "What you love", short: "Love", color: "#d9546f" },
  { id: "skill", stepId: "profession", label: "What you're good at", short: "Strengths", color: "#4a73a8" },
  { id: "world", stepId: "mission", label: "What the world needs", short: "World", color: "#2f8a6d" },
  { id: "paid", stepId: "vocation", label: "What you can be paid for", short: "Livelihood", color: "#c98a1b" },
] as const;

export const CIRCLE_BY_STEP = Object.fromEntries(
  IKIGAI_CIRCLES.map((c) => [c.stepId, c])
) as Record<IkigaiCircle["stepId"], IkigaiCircle>;

export interface IkigaiIntersection {
  key: Exclude<keyof IkigaiScores, "OverallCompatibility">;
  label: string;
  between: [CircleId, CircleId];
}

/** Classic ikigai overlaps. Keys match the score fields stored per statement. */
export const IKIGAI_INTERSECTIONS: readonly IkigaiIntersection[] = [
  { key: "Passion", label: "Passion", between: ["love", "skill"] },
  { key: "Mission", label: "Mission", between: ["love", "world"] },
  { key: "Vocation", label: "Vocation", between: ["world", "paid"] },
  { key: "Profession", label: "Profession", between: ["skill", "paid"] },
] as const;

export const DEFAULT_COVER = "/assets/bg_image.webp";
