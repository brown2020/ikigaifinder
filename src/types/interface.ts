import { QuestionStepper } from "./question";

export interface navItemType {
  label: string;
  icon: React.ReactNode;
  path: string;
  surveySet?: "ikigai";
}

export interface questionStepT {
  id: string;
  title: string;
  description: string;
  button?: string;
  questions: QuestionStepper[];
}
