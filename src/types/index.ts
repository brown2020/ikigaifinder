/**
 * Centralized type definitions for the Ikigai Finder application
 */

import type { Timestamp } from "firebase/firestore";
import type { FieldValues } from "react-hook-form";
import type { CircleId } from "@/constants/ikigai";

// ============================================================================
// Question & Survey Types
// ============================================================================

export interface QuestionValidation {
  required: boolean | string;
  maxLength?: number;
  message: string;
}

export interface QuestionStepper {
  id: keyof FieldValues;
  label: string;
  type: "text" | "textarea" | "select" | "select-tags";
  options?: string[];
  multiple?: boolean;
  placeholder?: string;
  answer?: string[];
  validation: QuestionValidation;
  /** Reflective nudges shown when someone is stuck. */
  hints?: string[];
}

export interface QuestionStep {
  id: string;
  title: string;
  description: string;
  button?: string;
  questions: QuestionStepper[];
}

export interface SurveyAnswer {
  id: string;
  type:
    | "multiple-choice"
    | "text-area"
    | "textarea-fixed"
    | "statement"
    | "input"
    | "multiselect"
    | "multiselect-wrap"
    | "form";
  question: string;
  options: string[];
  answer: string[];
}

// ============================================================================
// Ikigai Types
// ============================================================================

export interface IkigaiScores {
  Passion: number;
  Profession: number;
  Vocation: number;
  Mission: number;
  OverallCompatibility: number;
}

export interface IkigaiData extends IkigaiScores {
  ikigai: string;
}

/** A personal read-out of one statement, written from the person's answers. */
export interface IkigaiReport {
  /** The statement this report explains; a new selection needs a new report. */
  statement: string;
  summary: string;
  circles: { circle: CircleId; insight: string; evidence: string }[];
  growthEdge: { circle: CircleId; advice: string };
  firstSteps: { title: string; detail: string }[];
  paths: { title: string; why: string }[];
  /** Two or three short words per circle for the personal diagram. */
  keywords: Record<CircleId, string[]>;
}

/** A week of small actions drawn from the report's first steps. */
export interface IkigaiExperiment {
  statement: string;
  startedAt: string;
  steps: { title: string; detail: string; done: boolean }[];
}

/** A statement the person chose earlier and later replaced. Dates are ISO strings. */
export interface IkigaiHistoryEntry extends IkigaiData {
  chosenAt: string | null;
  replacedAt: string;
}

export interface Ikigai {
  id: string;
  answers: QuestionStep[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  ikigaiOptions: IkigaiData[];
  ikigaiSelected: IkigaiData | null;
  /** ISO date the current statement was chosen. */
  ikigaiSelectedAt?: string | null;
  ikigaiHistory?: IkigaiHistoryEntry[];
  /** Statements the person starred to compare; kept when new answers clear the options. */
  ikigaiShortlist?: IkigaiData[];
  ikigaiGuidance: string;
  ikigaiImage: string;
  ikigaiCoverImage: string;
  /** Name shown on the card, reused for the extra download sizes. */
  ikigaiCardName?: string;
  ikigaiReport?: IkigaiReport | null;
  ikigaiExperiment?: IkigaiExperiment | null;
  /** Written only by the server sharing route. */
  ikigaiSharableUrl?: boolean;
}

// ============================================================================
// User & Profile Types
// ============================================================================

export interface UserProfile {
  email: string;
  contactEmail: string;
  displayName: string;
  photoUrl: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  headerUrl?: string;
  organization?: string;
  title?: string;
  bio?: string;
  interests?: string;
  location?: string;
  country?: string;
  identifyWith?: string[];
  website?: string;
  linkedin?: string;
  purposeId?: string;
  moonshotId?: string;
  answers: SurveyAnswer[];
}

// ============================================================================
// Image Generation Types
// ============================================================================

export interface ImagePromptData {
  style?: string;
  mindset?: string;
  grandChallenge?: string;
  exponentialTechnology?: string;
  freestyle?: string;
  downloadUrl?: string;
  prompt?: string;
  timestamp?: Timestamp;
  id?: string;
}

/** Server-read subset of the ikigai document for the dashboard and share page. */
export interface IkigaiSummary {
  coverImage: string | null;
  sharable: boolean;
  statement: string | null;
  /** Personal map words, present only when the report matches the statement. */
  keywords: IkigaiReport["keywords"] | null;
}
