"use client";

import { useState } from "react";
import { Check, FlaskConical, Footprints } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useIkigaiStore } from "@/zustand";
import { hasCurrentReport } from "@/utils/journey";
import { cn } from "@/utils/cn";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The report's first steps as a 7-day experiment the person can tick off.
 * Before it starts, the steps are shown as suggestions with a start button.
 */
export default function ExperimentCard({ className }: { className?: string }) {
  const ikigai = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const [now] = useState(() => Date.now());

  const report = hasCurrentReport(ikigai) ? ikigai.ikigaiReport : null;
  const statement = ikigai.ikigaiSelected?.ikigai;
  const experiment = ikigai.ikigaiExperiment?.statement === statement ? ikigai.ikigaiExperiment : null;
  if (!report && !experiment) return null;

  const start = async () => {
    if (!report || !statement) return;
    const ok = await updateIkigai({
      ikigaiExperiment: {
        statement,
        startedAt: new Date().toISOString(),
        steps: report.firstSteps.map((s) => ({ ...s, done: false })),
      },
    });
    if (ok) toast.success("Your 7-day experiment has started");
    else toast.error("We couldn't start your experiment. Please try again.");
  };

  const toggle = (index: number) => {
    if (!experiment) return;
    const steps = experiment.steps.map((s, i) => (i === index ? { ...s, done: !s.done } : s));
    void updateIkigai({ ikigaiExperiment: { ...experiment, steps } });
  };

  const doneCount = experiment?.steps.filter((s) => s.done).length ?? 0;
  const total = experiment?.steps.length ?? 0;
  const day = experiment ? Math.min(7, Math.floor((now - new Date(experiment.startedAt).getTime()) / DAY_MS) + 1) : 0;
  const finished = experiment && doneCount === total;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          {experiment ? (
            <FlaskConical className="size-5 text-primary" aria-hidden="true" />
          ) : (
            <Footprints className="size-5 text-primary" aria-hidden="true" />
          )}
          {experiment ? "Your 7-day experiment" : "Try this week"}
        </h2>
        {experiment && (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {finished ? "Complete" : `Day ${day} of 7`}
          </span>
        )}
      </div>

      {experiment ? (
        <>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(doneCount / Math.max(total, 1)) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {finished
              ? "You did all three. Notice what energized you; that's evidence for your ikigai."
              : `${doneCount} of ${total} done`}
          </p>
          <ul className="mt-4 space-y-2">
            {experiment.steps.map((step, i) => (
              <li key={step.title}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={step.done}
                  onClick={() => toggle(i)}
                  className="flex w-full gap-3 rounded-xl p-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors",
                      step.done ? "border-primary bg-primary text-primary-foreground" : "border-border-strong"
                    )}
                  >
                    {step.done && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span>
                    <span className={cn("block font-medium", step.done && "text-muted-foreground line-through")}>{step.title}</span>
                    <span className="block text-sm text-muted-foreground">{step.detail}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        report && (
          <>
            <ol className="mt-4 space-y-4">
              {report.firstSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-medium">{step.title}</span>
                    <span className="block text-sm text-muted-foreground">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Button className="mt-5" size="sm" onClick={start} leftIcon={<FlaskConical className="size-4" aria-hidden="true" />}>
              Start a 7-day experiment
            </Button>
          </>
        )
      )}
    </Card>
  );
}
