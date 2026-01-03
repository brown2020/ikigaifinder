"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useIkigaiStore } from "@/zustand";

// ============================================================================
// Types
// ============================================================================

interface IkigaiStepperProps {
  /** Current step (1-6) */
  currentStep: number;
  /** Optional callback when a step is clicked */
  onStepClick?: (step: number) => void;
}

// ============================================================================
// Constants
// ============================================================================

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Passion",
  "Profession", 
  "Mission",
  "Vocation",
  "Generate Ideas",
  "Make Beautiful",
] as const;

// ============================================================================
// Component
// ============================================================================

/**
 * Ikigai Journey Stepper Component
 * 
 * Shows the 6-step progress through the Ikigai creation process:
 * 1-4: Survey questions (Passion, Profession, Mission, Vocation)
 * 5: Generate Ikigai Ideas
 * 6: Make Beautiful (Image generation)
 */
export default function IkigaiStepper({
  currentStep,
  onStepClick,
}: IkigaiStepperProps): React.ReactElement {
  const router = useRouter();
  const ikigaiData = useIkigaiStore((state) => state.ikigaiData);

  /**
   * Check if all survey questions are answered
   */
  const allQuestionsAnswered = useMemo(() => {
    return ikigaiData.answers.every((step) =>
      step.questions.every((q) => q.answer && q.answer.length > 0)
    );
  }, [ikigaiData.answers]);

  /**
   * Check if a specific survey step is complete
   */
  const isStepComplete = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex <= 4) {
        const step = ikigaiData.answers[stepIndex - 1];
        return step?.questions.every((q) => q.answer && q.answer.length > 0) ?? false;
      }
      if (stepIndex === 5) {
        return allQuestionsAnswered;
      }
      if (stepIndex === 6) {
        return !!ikigaiData.ikigaiSelected;
      }
      return false;
    },
    [ikigaiData.answers, ikigaiData.ikigaiSelected, allQuestionsAnswered]
  );

  /**
   * Check if a step is accessible
   */
  const isStepAccessible = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex === 1) return true;
      if (stepIndex <= 4) {
        // Can access if previous steps are complete
        for (let i = 1; i < stepIndex; i++) {
          if (!isStepComplete(i)) return false;
        }
        return true;
      }
      if (stepIndex === 5) {
        return allQuestionsAnswered;
      }
      if (stepIndex === 6) {
        return !!ikigaiData.ikigaiSelected;
      }
      return false;
    },
    [isStepComplete, allQuestionsAnswered, ikigaiData.ikigaiSelected]
  );

  /**
   * Handle step click
   */
  const handleStepClick = useCallback(
    (stepIndex: number): void => {
      if (!isStepAccessible(stepIndex)) return;

      if (onStepClick) {
        onStepClick(stepIndex);
        return;
      }

      // Default navigation
      if (stepIndex <= 4) {
        router.push(`/ikigai-finder?step=${stepIndex}`);
      } else if (stepIndex === 5) {
        router.push("/generate-ikigai");
      } else if (stepIndex === 6) {
        router.push("/generate-ikigai?step=image");
      }
    },
    [isStepAccessible, onStepClick, router]
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
          const stepNumber = index + 1;
          const isComplete = isStepComplete(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isAccessible = isStepAccessible(stepNumber);

          return (
            <div key={stepNumber} className="flex items-center">
              <button
                type="button"
                onClick={() => handleStepClick(stepNumber)}
                disabled={!isAccessible}
                className={`
                  h-8 w-8 flex items-center justify-center rounded-full 
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                  ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-md"
                      : isComplete || isAccessible
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                aria-label={`Step ${stepNumber}: ${STEP_LABELS[index]}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {stepNumber}
              </button>
            </div>
          );
        })}
      </div>

      {/* Current step label */}
      <div className="text-center mt-2">
        <span className="text-sm text-gray-600">
          Step {currentStep} of {TOTAL_STEPS}: {STEP_LABELS[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}










