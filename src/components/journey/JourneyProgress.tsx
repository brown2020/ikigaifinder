"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useIkigaiStore } from "@/zustand";
import { completedSteps, isSurveyComplete, JOURNEY_STEPS, type JourneyStepKey } from "@/utils/journey";
import { cn } from "@/utils/cn";

const STEP_COLORS: Partial<Record<JourneyStepKey, string>> = {
  passion: "#d9546f",
  profession: "#4a73a8",
  mission: "#2f8a6d",
  vocation: "#c98a1b",
};

export default function JourneyProgress({
  current,
  onSelectSection,
}: {
  current: JourneyStepKey;
  /** Handles clicks on questionnaire sections in place instead of navigating. */
  onSelectSection?: (section: number) => void;
}): React.ReactElement {
  const ikigai = useIkigaiStore((s) => s.ikigaiData);
  const done = completedSteps(ikigai);
  const surveyDone = isSurveyComplete(ikigai.answers);
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.key === current);

  const isReachable = (index: number) => {
    if (index <= currentIndex) return true;
    if (index < 4) return JOURNEY_STEPS.slice(0, index).every((s) => done.has(s.key));
    if (index === 4) return surveyDone;
    return done.has("ideas");
  };

  return (
    <nav aria-label="Journey progress" className="w-full">
      <p className="mb-3 text-xs font-medium text-muted-foreground sm:hidden">
        Step {currentIndex + 1} of {JOURNEY_STEPS.length} · {JOURNEY_STEPS[currentIndex]?.label}
      </p>
      <ol className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {JOURNEY_STEPS.map((step, index) => {
          const isCurrent = step.key === current;
          const isDone = done.has(step.key);
          const reachable = isReachable(index);
          const color = STEP_COLORS[step.key] ?? "#b8401a";
          const bar = (
            <>
              <span
                className="block h-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: isCurrent || isDone ? color : "#e6ded3", opacity: isDone && !isCurrent ? 0.55 : 1 }}
              />
              <span
                className={cn(
                  "mt-2 hidden items-center gap-1 text-xs font-medium sm:flex",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {isDone && !isCurrent && <Check className="size-3" aria-hidden="true" />}
                {step.label}
              </span>
            </>
          );
          const label = `Step ${index + 1}: ${step.label}${isDone ? " (complete)" : ""}`;
          return (
            <li key={step.key}>
              {reachable && !isCurrent ? (
                onSelectSection && index < 4 ? (
                  <button type="button" onClick={() => onSelectSection(index + 1)} aria-label={label} className="block w-full rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {bar}
                  </button>
                ) : (
                  <Link href={step.href} aria-label={label} className="block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {bar}
                  </Link>
                )
              ) : (
                <div aria-label={label} aria-current={isCurrent ? "step" : undefined}>
                  {bar}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
