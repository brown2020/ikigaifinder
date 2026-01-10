"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import FormField from "./FormField";
import { Button } from "./ui/Button";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";
import type { QuestionStep } from "@/types";
import { useIkigaiStore } from "@/zustand";
import { useRouter } from "next/navigation";
import IkigaiStepper from "./IkigaiStepper";

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
      <div className="mx-auto sm:p-6 p-4 py-6 bg-card text-card-foreground shadow-md border border-border rounded-xl w-full max-w-3xl">
        <div className="mb-6">
          <IkigaiStepper
            currentStep={step}
            onStepClick={(stepIndex) => {
              if (stepIndex <= 4) {
                handleStepClick(stepIndex);
                return;
              }
              if (stepIndex === 5) router.push("/generate-ikigai");
              if (stepIndex === 6) router.push("/generate-ikigai?step=image");
            }}
          />
        </div>
        {/* Title and Description */}
        <h2 className="text-3xl font-bold mb-2">
          {currentStep?.title}
        </h2>
        <p className="text-lg text-muted-foreground font-semibold mb-6">
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
        </form>
      </div>
    </div>
  );
};

export default IkigaiStepperForm;
