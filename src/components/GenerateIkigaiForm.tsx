"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Tooltip } from "react-tooltip";
import CircularProgressWithIcon from "./CircularProgressWithIcon";
import IkigaiStepper from "./IkigaiStepper";
import { IkigaiOptionsLoadingSkeleton } from "./ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useIkigaiStore } from "@/zustand";
import { useIkigaiGenerator } from "@/hooks/use-ikigai-generator";
import type { IkigaiData } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface GenerateIkigaiFormProps {
  setIsSaveIkigai: (value: boolean) => void;
}

// ============================================================================
// Constants
// ============================================================================

const IKIGAI_COLORS = {
  ikigai: "#FF9F1C",
  passion: "#3A86FF",
  profession: "#3A86FF",
  vocation: "#3A86FF",
  mission: "#3A86FF",
} as const;

// ============================================================================
// Component
// ============================================================================

export default function GenerateIkigaiForm({
  setIsSaveIkigai,
}: GenerateIkigaiFormProps): React.ReactElement {
  const router = useRouter();

  // Store state
  const ikigaiData = useIkigaiStore((state) => state.ikigaiData);
  const updateIkigai = useIkigaiStore((state) => state.updateIkigai);
  const isStoreLoading = useIkigaiStore((state) => state.isLoading);

  // Local state
  const [ikigaiOptions, setIkigaiOptions] = useState<IkigaiData[]>([]);
  const [guidance, setGuidance] = useState("");
  const [selectedIkigai, setSelectedIkigai] = useState<IkigaiData | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Generator hook
  const { generate, isGenerating, resultEndRef, error } = useIkigaiGenerator({
    ikigaiData: ikigaiOptions,
    onDataUpdate: setIkigaiOptions,
    guidance,
  });

  // Check if all questions have been answered
  const hasCompletedSurvey = useMemo(() => {
    return ikigaiData.answers
      .flatMap((step) => step.questions)
      .every((q) => q.answer && q.answer.length > 0);
  }, [ikigaiData.answers]);

  // Initialize from store data
  useEffect(() => {
    if (hasInitialized) return;

    if (hasCompletedSurvey && !ikigaiData.ikigaiOptions.length) {
      generate(ikigaiData.answers);
      setHasInitialized(true);
    }

    if (ikigaiData.ikigaiOptions.length) {
      setIkigaiOptions(ikigaiData.ikigaiOptions);
      setSelectedIkigai(ikigaiData.ikigaiSelected);
      setGuidance(ikigaiData.ikigaiGuidance);
      setHasInitialized(true);
    }
  }, [ikigaiData, hasCompletedSurvey, generate, hasInitialized]);

  // Handlers
  const handleSelectIkigai = useCallback((item: IkigaiData): void => {
    setSelectedIkigai(item);
  }, []);

  const handleGenerateIkigai = useCallback((): void => {
    generate(ikigaiData.answers);
  }, [generate, ikigaiData.answers]);

  const handleSaveMyIkigai = useCallback((): void => {
    updateIkigai({
      ikigaiOptions,
      ikigaiSelected: selectedIkigai,
      ikigaiGuidance: guidance,
    });
    setIsSaveIkigai(true);
  }, [updateIkigai, ikigaiOptions, selectedIkigai, guidance, setIsSaveIkigai]);

  const handleNavigateToSurvey = useCallback((): void => {
    router.push("/ikigai-finder");
  }, [router]);

  // Show message if survey not completed
  if (!hasCompletedSurvey && !isStoreLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] w-full">
        <h1 className="text-3xl font-bold max-w-3xl text-center">
          Your ikigai information is currently unavailable. Please complete the
          survey first.
        </h1>
        <Button
          type="button"
          variant="primary"
          onClick={handleNavigateToSurvey}
          className="mt-6"
        >
          Create your Ikigai
        </Button>
      </div>
    );
  }

  return (
    <div className="md:p-10 sm:mb-7 mb-12 p-5 gap-4 flex flex-col justify-center items-center">
      {/* Progress Stepper */}
      <div className="w-full max-w-3xl mb-4">
        <IkigaiStepper currentStep={5} />
      </div>

      {/* Header Section */}
      <div className="w-full max-w-3xl">
        <div className="flex gap-2 items-start">
          <h1 className="text-3xl font-bold mb-4">Generate Ikigai Ideas</h1>
          <Info
            data-tooltip-id="ikigai-info-tooltip"
            size={30}
            className="mt-1 cursor-help"
          />
        </div>

        <Tooltip
          id="ikigai-info-tooltip"
          className="max-w-96 z-50"
          place="bottom"
        >
          <p className="text-lg font-semibold mb-6">
            Click &quot;Generate Ideas&quot; to explore suggestions from our AI
            model tailored to your Ikigai journey. For more inspiration, click
            again to uncover additional options.
          </p>
          <p className="text-lg font-semibold mb-6">
            When you discover an idea that resonates with you, select it to set
            it as your draft Ikigai. In the next step, you can edit and refine
            your Ikigai further.
          </p>
        </Tooltip>

        {/* Guidance Input */}
        <Textarea
          id="ikigai-guidance"
          label="Guidance (optional)"
          helperText="Add any preferences so the AI can tailor ideas better."
          placeholder="Example: I want something creative, community-focused, and flexible."
          onChange={(e) => setGuidance(e.target.value)}
          value={guidance}
          className="font-medium"
        />

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error.message}
          </div>
        )}

        {/* Generate Button */}
        <div className="w-full bg-white pb-2 sticky top-0 sm:top-[64px] z-10">
          <Button
            onClick={handleGenerateIkigai}
            variant="primary"
            isLoading={isGenerating}
            loadingText="Generating..."
            leftIcon={!isGenerating && <Lightbulb size={18} />}
            className="mx-auto flex sm:mt-6 mt-1 min-w-56 min-h-10"
            type="button"
          >
            Generate more ideas
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-3xl mt-6">
        {ikigaiOptions.length > 0 ? (
          <div className="flex flex-col md:p-4 md:border rounded-md w-full max-w-3xl">
            <ul className="overflow-y-auto min-h-[350px] text-gray-600">
              {ikigaiOptions.map((item, index) => (
                <IkigaiOptionCard
                  key={`${item.ikigai}-${index}`}
                  item={item}
                  isSelected={selectedIkigai?.ikigai === item.ikigai}
                  onSelect={handleSelectIkigai}
                />
              ))}
              <div ref={resultEndRef} />
            </ul>
          </div>
        ) : isGenerating ? (
          <IkigaiOptionsLoadingSkeleton count={3} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Lightbulb size={48} className="mb-4 opacity-50" />
            <p className="text-lg">Click &quot;Generate More Ideas&quot; to get started</p>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="w-full max-w-3xl fixed sm:bottom-0 bottom-[52px] bg-white">
        <div className="flex justify-between items-center mt-2 max-w-3xl mb-1 px-5">
          <Button
            type="button"
            onClick={handleNavigateToSurvey}
            variant="neutral"
          >
            Back
          </Button>
          <Button
            onClick={handleSaveMyIkigai}
            disabled={isGenerating || !selectedIkigai}
            variant="primary"
            type="button"
          >
            Save ikigai
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

interface IkigaiOptionCardProps {
  item: IkigaiData;
  isSelected: boolean;
  onSelect: (item: IkigaiData) => void;
}

function IkigaiOptionCard({
  item,
  isSelected,
  onSelect,
}: IkigaiOptionCardProps): React.ReactElement {
  return (
    <li className="mt-4">
      <button
        type="button"
        className={`w-full text-left md:p-4 p-2 border rounded-md shadow-md hover:bg-blue-100 transition-colors duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isSelected ? "bg-blue-200 border-blue-400" : ""
        }`}
        onClick={() => onSelect(item)}
        aria-pressed={isSelected}
      >
        {item.ikigai.replace(/\*\*/g, "")}

        <div className="flex flex-wrap xs:gap-2 gap-1 mt-4">
          <ScoreDisplay
            title="Ikigai"
            value={item.OverallCompatibility}
            color={IKIGAI_COLORS.ikigai}
            Icon={Target}
          />
          <ScoreDisplay
            title="Passion"
            value={item.Passion}
            color={IKIGAI_COLORS.passion}
            Icon={Heart}
          />
          <ScoreDisplay
            title="Profession"
            value={item.Profession}
            color={IKIGAI_COLORS.profession}
            Icon={Medal}
          />
          <ScoreDisplay
            title="Vocation"
            value={item.Vocation}
            color={IKIGAI_COLORS.vocation}
            Icon={PencilRuler}
          />
          <ScoreDisplay
            title="Mission"
            value={item.Mission}
            color={IKIGAI_COLORS.mission}
            Icon={Rocket}
          />
        </div>
      </button>
    </li>
  );
}

interface ScoreDisplayProps {
  title: string;
  value: number;
  color: string;
  Icon: React.ElementType;
}

function ScoreDisplay({
  title,
  value,
  color,
  Icon,
}: ScoreDisplayProps): React.ReactElement {
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
}
