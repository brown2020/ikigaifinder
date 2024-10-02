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
