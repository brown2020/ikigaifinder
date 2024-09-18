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
