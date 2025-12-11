"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import FormField from "./FormField";
import { Button } from "./ui/Button";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";
import type { QuestionStep } from "@/types";
import { useIkigaiStore } from "@/zustand";
import { useRouter } from "next/navigation";
import withAuth from "./withAuth";

const IkigaiStepperForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
  } = useForm<FieldValues>();
  const router = useRouter();
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuestionStep[]>(
    STEPPER_QUESTIONS_JSON
  );
  const currentStep = useMemo(() => {
    return formData.find((_, index) => index + 1 === step);
  }, [formData, step]);

  useEffect(() => {
    const defaultValues = fetchIkigaiData?.answers?.reduce<
      Record<string, string | string[]>
    >((acc, step) => {
      step.questions.forEach((question) => {
        acc[question.id] = question?.answer || [];
      });
      return acc;
    }, {});
    setFormData(fetchIkigaiData?.answers);
    Object.entries(defaultValues).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [fetchIkigaiData?.answers, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data, e) => {
    e?.preventDefault();

    if (step < formData.length) {
      setStep((prev) => prev + 1);
    }
    const currentStep = formData[step - 1];
    if (!currentStep) return;
    const updatedStep = {
      ...currentStep,
      questions: currentStep.questions.map((q) => ({
        ...q,
        answer: Array.isArray(data[q.id]) ? data[q.id] : [data[q.id]],
      })),
    };
    const updatedStepperData = formData.map((item) =>
      item.id === currentStep.id ? updatedStep : item
    );

    const checkAnswersMatch = (
      mainArray: QuestionStep[],
      obj: Record<string, string[]>
    ) => {
      return mainArray.every((section) =>
        section.questions.every(
          (question) => obj?.[question.id]?.[0] === question?.answer?.[0]
        )
      );
    };

    // Example usage
    const matches = checkAnswersMatch(fetchIkigaiData?.answers ?? [], data);

    setFormData(updatedStepperData);
    await updateIkigai({ answers: updatedStepperData });
    if (!matches) {
      await updateIkigai({
        ikigaiOptions: [],
        ikigaiSelected: null,
      });
    }
    if (step === formData.length) {
      router.push("/generate-ikigai");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setStep(stepIndex);
  };

  return (
    <div className="flex justify-center gap-4">
      <div className="mx-auto sm:p-6 p-4 py-6 bg-white shadow-md sm:rounded-sm w-full max-w-3xl">
        {/* Title and Description */}
        <h2 className="text-3xl text-gray-700  font-bold mb-2">
          {currentStep?.title}
        </h2>
        <p className="text-lg text-gray-700  font-semibold mb-6">
          {currentStep?.description}
        </p>

        {/* Form fields */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep?.questions.map((question) => (
            <FormField
              key={question.id}
              question={question}
              register={register}
              errors={errors}
              watch={watch}
              setError={setError}
              control={control}
            />
          ))}

          {/* Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="neutral"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>

            <Button type="submit" variant="primary">
              {currentStep?.button || "Continue"}
            </Button>
          </div>

          {/* Stepper navigation bar */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: 6 }).map((_, index) => {
              const stepIndex = index + 1;
              let isDataExit = false;
              let isCurrentStep = false;
              let isDisabled = true;
              let handleClick = () => {};

              if (stepIndex <= 4) {
                const item = formData[index];
                isDataExit = item?.questions.every(
                  (question) => question.answer && question.answer?.length > 0
                );
                isCurrentStep = step === stepIndex;
                isDisabled = stepIndex > step && !isDataExit;
                handleClick = () => handleStepClick(stepIndex);
              } else if (stepIndex === 5) {
                const allQuestionsAnswered = formData.every((item) =>
                  item.questions.every((q) => q.answer && q.answer.length > 0)
                );
                isDataExit = allQuestionsAnswered;
                isCurrentStep = false;
                isDisabled = !allQuestionsAnswered;
                handleClick = () => router.push("/generate-ikigai");
              } else if (stepIndex === 6) {
                const hasSelected = !!fetchIkigaiData?.ikigaiSelected;
                isDataExit = hasSelected;
                isCurrentStep = false;
                isDisabled = !hasSelected;
                handleClick = () => router.push("/generate-ikigai?step=image");
              }

              return (
                <div key={stepIndex} className="flex items-center">
                  <button
                    type="button"
                    className={`h-8 w-8 flex items-center justify-center rounded-full focus:outline-hidden ${
                      isCurrentStep
                        ? "bg-blue-600 text-white"
                        : !isDisabled
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
                        : "bg-gray-300 text-gray-700"
                    }`}
                    onClick={handleClick}
                    disabled={isDisabled}
                  >
                    {stepIndex}
                  </button>
                </div>
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(IkigaiStepperForm);
