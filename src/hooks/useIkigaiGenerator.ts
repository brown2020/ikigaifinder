import { useState, useRef } from "react";
import { generateIkigai } from "@/lib/generateIkigai";
import { readStreamableValue } from "@ai-sdk/rsc";
import { ikigaiDataT, questionStepT } from "@/types/interface";
import { extractIkigaiData, mergeIkigaiLists } from "@/utils/ikigaiParser";

interface UseIkigaiGeneratorProps {
  ikigaiData: ikigaiDataT[];
  setIkigaiData: (data: ikigaiDataT[]) => void;
  guidance: string;
}

export const useIkigaiGenerator = ({
  ikigaiData,
  setIkigaiData,
  guidance,
}: UseIkigaiGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const resultEndRef = useRef<HTMLDivElement | null>(null);

  const generate = async (stepperData: questionStepT[]) => {
    setIsLoading(true);
    
    // Prepare question data for AI
    const questionData = stepperData.map((item) => {
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

    const customPrompt = guidance
      ? `Incorporate the following additional guidance in shaping your response: ${guidance}`
      : "";

    try {
      const result = await generateIkigai(questionData, customPrompt);

      for await (const content of readStreamableValue(result)) {
        if (content) {
          const ikigaiList = extractIkigaiData(content);
          
          // If we have enough results, stop the loading spinner early for better UX? 
          // Actually original code did this:
          if (ikigaiList.length >= 5) {
            setIsLoading(false);
          }

          const mergedData = mergeIkigaiLists(ikigaiData, ikigaiList);
          setIkigaiData(mergedData);
          
          // Scroll to bottom
          resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.error("Error generating Ikigai:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generate,
    isLoading,
    resultEndRef,
  };
};


