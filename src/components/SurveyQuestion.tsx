"use client";

import React from "react";
import Select, { MultiValue } from "react-select";
import type { SurveyQuestion as SurveyQuestionType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface SurveyQuestionProps {
  question: SurveyQuestionType;
  onChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { value: string; label: string }[]
      | null
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  onChange,
  onSubmit,
}) => {
  const handleSelectChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    onChange(newValue as { value: string; label: string }[] | null);
  };

  const handleNativeChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange(e);
  };

  const renderInput = () => {
    switch (question.questionType) {
      case "textarea":
        return (
          <Textarea
            name={question.name}
            required
            placeholder={question.question}
            value={question.answer[0] || ""}
            onChange={handleNativeChange}
            className="text-lg"
          />
        );
      case "select":
        return (
          <select
            name={question.name}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            value={question.answer[0] || ""}
            onChange={handleNativeChange}
          >
            <option value="" disabled>
              Select an option
            </option>
            {question.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <Select
            isMulti
            name={question.name}
            options={question.options?.map((option: string) => ({
              value: option,
              label: option,
            }))}
            value={question.answer.map((value: string) => ({
              value,
              label: value,
            }))}
            onChange={handleSelectChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        );
      case "text":
        return (
          <Input
            name={question.name}
            type="text"
            required
            placeholder={question.question}
            value={question.answer[0] || ""}
            onChange={handleNativeChange}
            className="text-lg"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form
        onSubmit={onSubmit}
        className="bg-card text-card-foreground shadow-md rounded-lg p-8 flex flex-col justify-between h-full border border-border"
      >
        <h2 className="text-2xl font-bold mb-4">
          {question.headline}
        </h2>
        <p className="text-muted-foreground mb-2">{question.information}</p>
        <p className="text-muted-foreground mb-4">{question.instructions}</p>
        <label className="block text-xl font-medium mb-4">
          {question.question}
        </label>
        {renderInput()}
        <Button type="submit" variant="primary" className="mt-6" fullWidth>
          Next
        </Button>
      </form>
    </div>
  );
};

export default SurveyQuestion;
