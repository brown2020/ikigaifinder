import React from "react";
import Select, { MultiValue } from "react-select";
import type { SurveyQuestion as SurveyQuestionType } from "@/types";

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
          <textarea
            name={question.name}
            required
            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder={question.question}
            value={question.answer[0] || ""}
            onChange={handleNativeChange}
            rows={4}
          />
        );
      case "select":
        return (
          <select
            name={question.name}
            required
            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 text-lg"
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
          <input
            name={question.name}
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder={question.question}
            value={question.answer[0] || ""}
            onChange={handleNativeChange}
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
        className="bg-white shadow-md rounded-lg p-8 flex flex-col justify-between h-full"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {question.headline}
        </h2>
        <p className="text-gray-700 mb-2">{question.information}</p>
        <p className="text-gray-500 mb-4">{question.instructions}</p>
        <label className="block text-xl font-medium text-gray-700 mb-4">
          {question.question}
        </label>
        {renderInput()}
        <button
          type="submit"
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default SurveyQuestion;
