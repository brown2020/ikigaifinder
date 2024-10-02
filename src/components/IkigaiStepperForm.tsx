"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import FormField from "./FormField";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";
import { questionStepT } from "@/types/interface";
import { readStreamableValue } from "ai/rsc";
import { generateIkigai } from "@/lib/generateIkigai";
import { useIkigaiStore } from "@/zustand";

interface ikigaiDataT {
  ikigai: string;
  PassionProfession: number;
  ProfessionVocation: number;
  MissionVocation: number;
  MissionPassion: number;
  OverallCompatibility: number;
}

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
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<questionStepT[]>(
    STEPPER_QUESTIONS_JSON
  );
  const [ikigaiData, setIkigaiData] = useState<ikigaiDataT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentStep = useMemo(() => {
    return formData.find((_, index) => index + 1 === step);
  }, [formData, step]);

  console.log("fetchIkigaiData", fetchIkigaiData?.answers);

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

  const extractIkigaiData = (text: string) => {
    const ikigaiArray = [];
    const regex =
      /(\d+)\.\s*(.*?)\n\s*-\s*Passion & Profession:\s*(\d+(?:\.\d+)?)%\s*-\s*Profession & Vocation:\s*(\d+(?:\.\d+)?)%\s*-\s*Vocation & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Passion & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Overall Compatibility:\s*(\d+(?:\.\d+)?)%/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      ikigaiArray.push({
        ikigai: match[2].trim(),
        PassionProfession: parseFloat(match[3]),
        ProfessionVocation: parseFloat(match[4]),
        MissionVocation: parseFloat(match[5]),
        MissionPassion: parseFloat(match[6]),
        OverallCompatibility: parseFloat(match[7]),
      });
    }

    return ikigaiArray;
  };

  const getGenerateIkigaiResult = async (
    updatedStepperData: questionStepT[]
  ) => {
    setIsLoading(true);
    const questionData = updatedStepperData.map((item) => {
      const questions = item.questions.map((q) => {
        return {
          question: q.label,
          answer: q.answer || [],
        };
      });
      return {
        id: item.id,
        questions,
      };
    });
    const result = await generateIkigai(questionData);

    for await (const content of readStreamableValue(result)) {
      if (content) {
        console.log("content", content);
        const ikigaiList = extractIkigaiData(content);
        console.log("ikigaiList", ikigaiList);
        if (ikigaiList.length === 10) {
          setIsLoading(false);
        }
        setIkigaiData(ikigaiList);
      }
    }
  };

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

    setFormData(updatedStepperData);
    await updateIkigai({ answers: updatedStepperData });
    if (step === formData.length) {
      await getGenerateIkigaiResult(updatedStepperData);
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= step) {
      setStep(stepIndex);
    }
  };

  const handleSelectIkigai = (item: ikigaiDataT) => {
    console.log("item", item);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <div className="mx-auto p-6 bg-white shadow-md rounded w-full"> */}
      <div className="mr-1">
        {/* Title and Description */}
        <h2 className="text-xl font-semibold mb-2 text-gray-600">
          {currentStep?.title}
        </h2>
        <p className="text-gray-600 mb-6">{currentStep?.description}</p>

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
            <button
              type="button"
              onClick={handleBack}
              className={`px-4 py-2 bg-gray-200 text-gray-700 rounded ${
                step === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-300"
              }`}
              disabled={step === 1}
            >
              Back
            </button>

            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : currentStep?.button || "Continue"}
            </button>
          </div>

          {/* Stepper navigation bar */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {formData.map((item, index) => {
              const stepIndex = index + 1;
              return (
                <div key={stepIndex} className="flex items-center">
                  <button
                    type="button"
                    className={`h-8 w-8 flex items-center justify-center rounded-full focus:outline-none ${
                      stepIndex <= step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleStepClick(stepIndex)}
                    disabled={stepIndex > step}
                  >
                    {stepIndex}
                  </button>
                </div>
              );
            })}
          </div>
        </form>
      </div>

      <div>
        {ikigaiData.length > 0 && (
          <div className="flex flex-col p-4 border rounded-md ">
            <ul className=" overflow-y-auto min-h-[350px] text-gray-600">
              {ikigaiData?.map((ikigaiItem, index) => (
                <li
                  className={`p-4 border rounded-md shadow-md cursor-pointer mt-2 mr-2`}
                  key={index}
                  onClick={() => handleSelectIkigai(ikigaiItem)}
                >
                  {ikigaiItem?.ikigai?.replace("**", "")}
                  <ul className="list-disc pl-4 mt-2">
                    <li>
                      Passion & Profession: {ikigaiItem?.PassionProfession}%
                    </li>
                    <li>
                      Profession & Vocation: {ikigaiItem?.ProfessionVocation}%
                    </li>
                    <li>Vocation & Mission: {ikigaiItem?.MissionVocation}%</li>
                    <li>Passion & Mission: {ikigaiItem?.MissionPassion}%</li>
                    <li>
                      Overall Compatibility: {ikigaiItem?.OverallCompatibility}%
                    </li>
                  </ul>
                </li>
              ))}
            </ul>

            {/* <div>
              <button className="btn-primary">Save Ikigai</button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default IkigaiStepperForm;
