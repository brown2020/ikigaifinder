import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  UseFormWatch,
  UseFormSetError,
  Controller,
  Control,
} from "react-hook-form";
import CustomMultiTag from "./CustomMultiTag";
import { QuestionStepper } from "@/types/question";

interface FormFieldProps {
  question: QuestionStepper;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  control: Control<FieldValues>;
  setError: UseFormSetError<FieldValues>;
}

const FormField: React.FC<FormFieldProps> = ({
  question,
  register,
  errors,
  control,
  setError,
}) => {
  const validateMaxLength = (selectedValues: string[]) => {
    if (selectedValues.length > (question.validation.maxLength || Infinity)) {
      setError(question.id, {
        type: "manual",
        message: question.validation.message,
      });
      return false;
    }
    return true;
  };

  const renderField = () => {
    switch (question.type) {
      case "text":
        return (
          <input
            className="w-full p-2 border border-gray-300 rounded-sm min-h-12 font-semibold "
            {...register(question.id, {
              required: question.validation.required,
            })}
            placeholder={question.placeholder}
          />
        );
      case "textarea":
        return (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-sm h-24 font-semibold "
            {...register(question.id, {
              required: question.validation.required,
            })}
            autoComplete="on"
            placeholder={question.placeholder}
          />
        );
      case "select":
        return (
          <select
            {...register(question.id)}
            className="w-full p-2 border rounded-sm font-semibold"
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "select-tags": // Handle "select-tags" type with Controller
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{
              required: question.validation.required,
              validate: {
                maxLength: (value) => validateMaxLength(value || []),
              },
            }}
            render={({ field: { onChange, value } }) => (
              <CustomMultiTag
                options={question.options || []}
                placeholder={question.placeholder || "Add tags..."}
                maxTags={question.validation.maxLength}
                value={value || []}
                onChange={(selected) => {
                  onChange(selected);
                }}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-2">
      <label className="block text-gray-700  font-semibold text-xl mb-2">
        {question.label}
      </label>
      <div className="text-gray-700">

      {renderField()}
      </div>

      <p className="text-red-500 text-sm mt-1 min-h-5">
        {errors[question.id] ? (errors[question.id]?.message as string) : ""}
      </p>
    </div>
  );
};

export default FormField;
