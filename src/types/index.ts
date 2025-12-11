/**
 * Centralized type definitions for the Ikigai Finder application
 */

import { Timestamp } from "firebase/firestore";
import type { FieldValues } from "react-hook-form";

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  profileUrl?: string;
  profileName?: string;
  surveySet?: "ikigai";
  subItems?: NavItem[];
}

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

export interface SurveyQuestion {
  name: string;
  headline: string;
  information: string;
  instructions: string;
  questionType: "select" | "multiselect" | "textarea" | "text";
  question: string;
  answer: string[];
  options?: string[];
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

export interface AuthUser {
  uid: string;
  authEmail: string;
  authDisplayName: string;
  authPhotoUrl: string;
  authEmailVerified: boolean;
  authReady: boolean;
  authPending: boolean;
  isAllowed: boolean;
  lastSignIn: Timestamp | null;
  offersOptIn: boolean;
  selectedName: string;
  premium: boolean;
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

export interface ArtStyle {
  id: number;
  value: string;
  label: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ImageGenerationResponse {
  imageUrl?: string;
  error?: string;
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface WithChildrenProps {
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AuthFormProps {
  onSuccess: () => void;
}

// ============================================================================
// Legacy Type Aliases (for backward compatibility during migration)
// ============================================================================

/** @deprecated Use NavItem instead */
export type navItemType = NavItem;

/** @deprecated Use QuestionStep instead */
export type questionStepT = QuestionStep;

/** @deprecated Use IkigaiData instead */
export type ikigaiDataT = IkigaiData;

/** @deprecated Use Ikigai instead */
export type ikigaiType = Ikigai;

/** @deprecated Use SurveyQuestion instead */
export type QuestionType = SurveyQuestion;

/** @deprecated Use SurveyAnswer instead */
export type AnswerType = SurveyAnswer;

/** @deprecated Use ImagePromptData instead */
export type PromptDataType = ImagePromptData;



