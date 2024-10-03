"use client";

import { generateIkigai } from "@/lib/generateIkigai";
import { ikigaiDataT, questionStepT } from "@/types/interface";
import { useIkigaiStore } from "@/zustand";
import { readStreamableValue } from "ai/rsc";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClipLoader, PulseLoader } from "react-spinners";
import { Tooltip } from "react-tooltip";

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

    const coustomPrompt = guidance
      ? `Incorporate the following additional guidance in shaping your response: ${guidance}`
      : "";
    const result = await generateIkigai(questionData, coustomPrompt);

    for await (const content of readStreamableValue(result)) {
      if (content) {
        const ikigaiList = extractIkigaiData(content);
        if (ikigaiList.length >= 10) {
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
          className={`px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mt-6`}
        >
          Create Your Ikigai
        </button>
      </div>
    );
  }
  return (
    <div className="p-10 gap-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="flex gap-1 items-start justify-between">
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
          className="w-full p-2 border border-gray-300 rounded h-24 font-semibold "
          autoComplete="on"
          placeholder="Enter your guidance here"
          onChange={(e) => setGuidance(e.target.value)}
          value={guidance}
          id="img"
        />
        <div
          className={`w-full bg-white pb-1 ${isSticky ? "fixed top-[50px] left-0" : ""}`}
          id="sticky-element"
        >
          <button
            onClick={handleGenerateIkigai}
            className={`px-6 py-2 bg-blue-500 text-white rounded  mx-auto flex mt-6 min-w-60 min-h-10 ${
              isLoading ? "cursor-not-allowed opacity-60" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full py-1 w-full">
                <PulseLoader color="#fff" size={10} />
              </div>
            ) : (
              "Generate More Ikigai Idea"
            )}
          </button>
        </div>
      </div>
      <div className="w-full max-w-3xl mt-6" ref={resultsContainerRef}>
        {ikigaiData.length > 0 ? (
          <div className="flex flex-col p-4 border rounded-md w-full max-w-3xl">
            <ul className=" overflow-y-auto min-h-[350px] text-gray-600 ">
              {ikigaiData?.map((ikigaiItem, index) => (
                <li
                  className={`p-4 border rounded-md shadow-md cursor-pointer mt-2 md:mr-2
                   hover:bg-blue-100 transition-colors duration-200
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
                  <ul className="list-disc pl-4 mt-2">
                    <li>Passion: {ikigaiItem?.PassionProfession}%</li>
                    <li>Profession: {ikigaiItem?.ProfessionVocation}%</li>
                    <li>Vocation: {ikigaiItem?.MissionVocation}%</li>
                    <li>Mission: {ikigaiItem?.MissionPassion}%</li>
                    <li>Ikigai: {ikigaiItem?.OverallCompatibility}%</li>
                  </ul>
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
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mt-3 max-w-3xl">
          <button
            type="button"
            onClick={() => router?.push("/ikigai-finder")}
            className={`px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300`}
          >
            Back
          </button>

          <button
            onClick={handleSaveMyIkigai}
            className={`px-6 py-2 bg-blue-500 text-white rounded ${
              isLoading ? "cursor-not-allowed opacity-60" : "hover:bg-blue-600"
            }`}
            disabled={isLoading || !selectedIkigai}
          >
            Save My Ikigai
          </button>
        </div>
      </div>
    </div>
  );
}