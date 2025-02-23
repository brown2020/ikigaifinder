"use client";

import { generateIkigai } from "@/lib/generateIkigai";
import { useIkigaiStore } from "@/zustand";
import { readStreamableValue } from "ai/rsc";
import {
  Heart,
  Info,
  Lightbulb,
  Medal,
  PencilRuler,
  Rocket,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClipLoader, PulseLoader } from "react-spinners";
import { Tooltip } from "react-tooltip";
import CircularProgressWithIcon from "./CircularProgressWithIcon";
import { ikigaiDataT, questionStepT } from "@/types/interface";

interface GenerateIkigaiFormT {
  setIsSaveIkigai: (val: boolean) => void;
}

export default function GenerateIkigaiForm({
  setIsSaveIkigai,
}: GenerateIkigaiFormT) {
  const router = useRouter();
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const ikigaiLoading = useIkigaiStore((s) => s.ikigaiLoading);
  const [ikigaiData, setIkigaiData] = useState<ikigaiDataT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guidance, setGuidance] = useState<string>("");
  const [selectedIkigai, setSelectedIkigai] = useState<ikigaiDataT | null>(
    null
  );
  const [isSticky, setIsSticky] = useState(false);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const resultEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ikigaiData]);
  const isIkigaiDataExit = useMemo(() => {
    return fetchIkigaiData?.answers
      ?.map((item) => item?.questions)
      ?.flat()
      ?.every((question) => question.answer && question.answer?.length > 0);
  }, [fetchIkigaiData?.answers]);

  const extractIkigaiData = (text: string) => {
    const ikigaiArray = [];
    const regex =
      /(\d+)\.\s*(.*?)\n\s*-\s*Passion & Profession:\s*(\d+(?:\.\d+)?)%\s*-\s*Profession & Vocation:\s*(\d+(?:\.\d+)?)%\s*-\s*Vocation & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Passion & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Overall Compatibility:\s*(\d+(?:\.\d+)?)%/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      ikigaiArray.push({
        ikigai: match[2].trim(),
        Passion: parseFloat(match[3]),
        Profession: parseFloat(match[4]),
        Vocation: parseFloat(match[5]),
        Mission: parseFloat(match[6]),
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

    const coustomPrompt = guidance
      ? `Incorporate the following additional guidance in shaping your response: ${guidance}`
      : "";
    const result = await generateIkigai(questionData, coustomPrompt);

    for await (const content of readStreamableValue(result)) {
      if (content) {
        const ikigaiList = extractIkigaiData(content);
        if (ikigaiList.length >= 5) {
          setIsLoading(false);
        }

        const data = [...ikigaiData, ...ikigaiList]?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.ikigai === item.ikigai)
        );

        setIkigaiData(data);
        resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isIkigaiDataExit && !fetchIkigaiData?.ikigaiOptions?.length) {
      getGenerateIkigaiResult(fetchIkigaiData?.answers);
    }
    if (fetchIkigaiData?.ikigaiOptions?.length) {
      setIkigaiData(fetchIkigaiData?.ikigaiOptions);
      setSelectedIkigai(fetchIkigaiData?.ikigaiSelected);
      setGuidance(fetchIkigaiData?.ikigaiGuidance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchIkigaiData, isIkigaiDataExit]);

  const handleSelectIkigai = (item: ikigaiDataT) => {
    setSelectedIkigai(item);
  };

  const handleGenerateIkigai = () => {
    getGenerateIkigaiResult(fetchIkigaiData?.answers);
  };

  const handleSaveMyIkigai = () => {
    updateIkigai({
      ikigaiOptions: ikigaiData,
      ikigaiSelected: selectedIkigai,
      ikigaiGuidance: guidance,
    });
    setIsSaveIkigai(true);
  };

  const handleScroll = () => {
    const element2 = document.getElementById("img");
    if (element2) {
      const rect2 = element2.getBoundingClientRect();
      setIsSticky(rect2.bottom <= 0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isIkigaiDataExit && !ikigaiLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] w-full">
        <h1 className="text-3xl font-bold max-w-3xl text-center">
          Your ikigai information is currently unavailable. Please generate your
          ikigai form.
        </h1>
        <button
          type="button"
          onClick={() => router?.push("/ikigai-finder")}
          className={`px-6 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 mt-6`}
        >
          Create Your Ikigai
        </button>
      </div>
    );
  }

  const renderIkiGaiPerformance = (
    title: string,
    value: number,
    color: string,
    Icon: React.ElementType
  ) => {
    return (
      <div className="md:mx-3 sm:min-w-[90px] xs:min-w-[65px] min-w-[70px]">
        <CircularProgressWithIcon value={value} color={color} Icon={Icon} />
        <div className="flex gap-1">
          <div className="text-center mx-auto md:text-xs text-[10px]">
            {title}({value}%)
          </div>
        </div>
      </div>
    );
  };

  const ikigaiColors = {
    ikigai: "#FF9F1C",
    passion: "#3A86FF",
    profession: "#3A86FF",
    vocation: "#3A86FF",
    mission: "#3A86FF",
  };
  return (
    <div className="md:p-10 sm:mb-7 mb-12 p-5 gap-4  flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="flex gap-2 items-start">
          <h1 className="text-3xl font-bold mb-4">Generate Ikigai Ideas</h1>
          <Info data-tooltip-id="my-tooltip" size={30} className="mt-1" />
        </div>
        <Tooltip id="my-tooltip" className="max-w-96 z-50" place="bottom">
          <p className="text-lg font-semibold mb-6">
            Click &quot;Generate Ideas&quot; to explore suggestions from our AI
            model tailored to your Ikigai journey. For more inspiration, click
            again to uncover additional options.
          </p>
          <p className="text-lg font-semibold mb-6">
            When you discover an idea that resonates with you, select it to set
            it as your draft Ikigai. In the next step, you can edit and refine
            your Ikigai further. If the AI-generated options are missing key
            elements you&apos;d like to incorporate, please provide your
            guidance below.
          </p>
        </Tooltip>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-sm h-24 font-semibold "
          autoComplete="on"
          placeholder="Enter your guidance here"
          onChange={(e) => setGuidance(e.target.value)}
          value={guidance}
          id="img"
        />
        <div
          className={`w-full bg-white pb-1 ${
            isSticky ? "sm:fixed sm:top-[50px] top-0 left-0 z-10" : ""
          }`}
          id="sticky-element"
        >
          <button
            onClick={handleGenerateIkigai}
            className={`px-6 py-2 bg-blue-500 text-white rounded  mx-auto flex sm:mt-6 mt-1 in-w-56 min-h-10 ${
              isLoading ? "cursor-not-allowed opacity-60" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full py-1 w-full">
                <PulseLoader color="#fff" size={10} />
              </div>
            ) : (
              <span className="flex gap-1 items-center justify-center mx-auto">
                <Lightbulb size={18} />
                Generate More Ideas
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-6" ref={resultsContainerRef}>
        {ikigaiData.length > 0 ? (
          <div className="flex flex-col md:p-4 md:border rounded-md w-full max-w-3xl">
            <ul className=" overflow-y-auto min-h-[350px] text-gray-600 ">
              {ikigaiData?.map((ikigaiItem, index) => (
                <li
                  className={`md:p-4 p-2 border rounded-md shadow-md cursor-pointer mt-4
                   hover:bg-blue-100 transition-colors duration-200
                   font-medium
                   ${
                     selectedIkigai &&
                     selectedIkigai?.ikigai === ikigaiItem?.ikigai
                       ? "bg-blue-200 border-blue-400"
                       : ""
                   }
                   `}
                  key={index}
                  onClick={() => handleSelectIkigai(ikigaiItem)}
                >
                  {ikigaiItem?.ikigai?.replace("**", "")}
                  <div className="flex flex-wrap xs:gap-2 gap-1 mt-4">
                    {renderIkiGaiPerformance(
                      "Ikigai",
                      ikigaiItem?.OverallCompatibility,
                      ikigaiColors?.ikigai,
                      Target
                    )}

                    {renderIkiGaiPerformance(
                      "Passion",
                      ikigaiItem?.Passion,
                      ikigaiColors?.passion,
                      Heart
                    )}
                    {renderIkiGaiPerformance(
                      "Profession",
                      ikigaiItem?.Profession,
                      ikigaiColors?.profession,
                      Medal
                    )}
                    {renderIkiGaiPerformance(
                      "Vocation",
                      ikigaiItem?.Vocation,
                      ikigaiColors?.vocation,
                      PencilRuler
                    )}
                    {renderIkiGaiPerformance(
                      "Mission",
                      ikigaiItem?.Mission,
                      ikigaiColors?.mission,
                      Rocket
                    )}
                  </div>
                </li>
              ))}
              <div ref={resultEndRef}></div>
            </ul>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-150px)] w-full">
            <ClipLoader color="black" size={80} />
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl fixed sm:bottom-0 bottom-[52px] bg-white">
        <div className="flex justify-between items-center mt-2 max-w-3xl mb-1 px-5">
          <button
            type="button"
            onClick={() => router?.push("/ikigai-finder")}
            className={`px-6 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Back
          </button>
          <button
            onClick={handleSaveMyIkigai}
            className={`px-6 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60`}
            disabled={isLoading || !selectedIkigai}
          >
            Save Ikigai
          </button>
        </div>
      </div>
    </div>
  );
}
