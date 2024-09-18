"use client";

import { useState, useRef, useEffect } from "react";
import { generatePurpose } from "../lib/actions";
import { QuestionType } from "../types/question";
import { readStreamableValue } from "ai/rsc";
import { questions } from "../constants/questions";
import SurveyQuestion from "./SurveyQuestion";
import GenerateImage from "./GenerateImage";

export default function PurposeSurvey() {
  const [purposes, setPurposes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>(
    Object.fromEntries(questions.map((q) => [q.name, []]))
  );
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const purposesEndRef = useRef<HTMLDivElement>(null);
  const [selectedPurpose, setSelectedPurpose] = useState("");

  const scrollToBottom = () => {
    purposesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [purposes]);

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { value: string; label: string }[]
      | null
  ) => {
    const name = questions[currentQuestionIndex].name;
    if (Array.isArray(e)) {
      const selectedOptions = e.map((option) => option.value);
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [name]: selectedOptions,
      }));
    } else if (e && "target" in e) {
      const { name, value } = e.target;
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [name]: [value],
      }));
    }
  };

  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handlePurpose();
    }
  };

  const handlePurpose = async () => {
    const questionsData: QuestionType[] = questions.map((q) => ({
      ...q,
      answer: answers[q.name],
    }));
    try {
      const result = await generatePurpose(questionsData);
      for await (const content of readStreamableValue(result)) {
        if (content) {
          setPurposes(content.trim().replace("\n\n", "\n").split("\n"));
        }
      }
      setError("");
    } catch (err) {
      console.error("Purpose Error:", err);
      setError("Failed to generate purpose statement");
    }
  };

  const handlePurposeSelection = (purpose: string) => {
    setSelectedPurpose(purpose);
  };

  return (
    <div className="flex flex-col items-center justify-center py-5 max-w-md w-full h-full space-y-8 mx-auto">
      <div className="flex flex-col space-y-6">
        {questions.map((input, index) => (
          <div
            key={input.name}
            className={index === currentQuestionIndex ? "block" : "hidden"}
          >
            <SurveyQuestion
              question={{
                ...input,
                answer: answers[input.name],
              }}
              onChange={handleChange}
              onSubmit={handleQuestionSubmit}
            />
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-6 p-4 border border-red-300 rounded-md bg-red-50 text-red-800">
          {error}
        </div>
      )}
      {purposes.length > 0 && (
        <div className="flex flex-col mt-4 p-4 border rounded-md space-y-4">
          <ul>
            {purposes.map((purpose, index) => (
              <li
                className={`p-4 border rounded-md shadow-md cursor-pointer ${
                  selectedPurpose === purpose ? "bg-blue-100" : ""
                }`}
                key={index}
                onClick={() => handlePurposeSelection(purpose)}
              >
                {purpose}
              </li>
            ))}
          </ul>
          <div ref={purposesEndRef} />
        </div>
      )}

      {selectedPurpose && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Selected Purpose:</h2>
          <p className="text-lg">{selectedPurpose}</p>
        </div>
      )}
      <GenerateImage defaultPrompt={selectedPurpose} />
    </div>
  );
}
