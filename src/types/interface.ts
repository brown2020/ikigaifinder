import { Timestamp } from "firebase/firestore";
import { QuestionStepper } from "./question";

export interface navItemType {
  label: string;
  icon: React.ElementType;
  path?: string;
  profileUrl?: string;
  profileName?: string;
  surveySet?: "ikigai";
  subItems?: navItemType[];
}

export interface questionStepT {
  id: string;
  title: string;
  description: string;
  button?: string;
  questions: QuestionStepper[];
}

export interface ikigaiDataT {
  ikigai: string;
  Passion: number;
  Profession: number;
  Vocation: number;
  Mission: number;
  OverallCompatibility: number;
}

export type ikigaiType = {
  id: string;
  answers: questionStepT[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  ikigaiOptions: ikigaiDataT[];
  ikigaiSelected: ikigaiDataT | null;
  ikigaiGuidance: string;
  ikigaiImage: string;
  ikigaiCoverImage: string;
};
