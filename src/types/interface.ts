import { QuestionStepper } from "./question";

export interface navItemType {
  label: string;
  icon: React.ElementType;
  path?: string;
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
  PassionProfession: number;
  ProfessionVocation: number;
  MissionVocation: number;
  MissionPassion: number;
  OverallCompatibility: number;
}