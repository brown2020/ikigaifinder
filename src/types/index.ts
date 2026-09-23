/**
 * Centralized type definitions for the Ikigai Finder application
 */

import type { Timestamp } from "firebase/firestore";
import type { FieldValues } from "react-hook-form";

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

export interface Ikigai {
  id: string;
  answers: QuestionStep[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  ikigaiOptions: IkigaiData[];
  ikigaiSelected: IkigaiData | null;
  ikigaiGuidance: string;
  ikigaiImage: string;
  ikigaiCoverImage: string;
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
}
