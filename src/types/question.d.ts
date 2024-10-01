import { FieldValues } from "react-hook-form";

export type QuestionType = {
  name: string;
  headline: string;
  information: string;
  instructions: string;
  questionType: "select" | "multiselect" | "textarea" | "text";
  question: string;
  answer: string[];
  options?: string[]; // optional property for select and multiselect types
};


interface QuestionStepper {
  id: keyof FieldValues;
  label: string;
  type: "text" | "textarea" | "select" | "select-tags";
  options?: string[];
  multiple?: boolean;
  placeholder?: string;
  answer?: string[];
  validation: {
    required: boolean | string;
    maxLength?: number;
    message: string;
  };
}

export type AnswerType = {
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
};