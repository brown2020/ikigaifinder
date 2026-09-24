"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Compass, Footprints, RotateCw, Sprout } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Skeleton } from "@/components/ui/Skeleton";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import ScoreBars from "@/components/ikigai/ScoreBars";
import { IKIGAI_CIRCLES } from "@/constants/ikigai";
import { generateIkigaiReport } from "@/lib/generateReport";
import { useIkigaiStore } from "@/zustand";
import { displayStatement } from "@/utils/ikigaiList";
import { hasCurrentReport } from "@/utils/journey";
import { toQuestionSections } from "@/utils/promptUtils";
import JourneyProgress from "./JourneyProgress";

const circleById = Object.fromEntries(IKIGAI_CIRCLES.map((c) => [c.id, c]));

function ReportSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Writing your report">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-28 rounded-2xl" />
    </div>
  );
}

export default function ReportStep(): React.ReactElement {
  const ikigai = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const selected = ikigai.ikigaiSelected;
  const report = hasCurrentReport(ikigai) ? ikigai.ikigaiReport : null;

  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoStarted = useRef(false);

  const write = useCallback(async () => {
    if (!selected) return;
    setIsWriting(true);
    setError(null);
    try {
      const result = await generateIkigaiReport(toQuestionSections(ikigai.answers), selected.ikigai);
      if (result.error) setError(result.error);
      else await updateIkigai({ ikigaiReport: result.report });
    } catch {
      setError("We couldn't write your report just now. Please try again.");
    } finally {
      setIsWriting(false);
    }
  }, [ikigai.answers, selected, updateIkigai]);

  useEffect(() => {
    if (autoStarted.current || report || !selected) return;
    autoStarted.current = true;
    void write();
  }, [report, selected, write]);

  if (!selected) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <Eyebrow>One step back</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold">Choose a statement first</h1>
        <p className="mt-3 text-muted-foreground">Your insights explain the ikigai statement you pick.</p>
        <ButtonLink href="/generate-ikigai" className="mt-8" size="lg">
          See my ideas
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-32 pt-8 sm:px-8 sm:pt-10">
      <JourneyProgress current="report" />

      <header className="mt-10 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div>
          <Eyebrow>Your insights</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {displayStatement(selected.ikigai)}
          </h1>
          <ScoreBars scores={selected} className="mt-6" />
        </div>
        {report && (
          <IkigaiDiagram
            className="mx-auto w-full max-w-[340px] animate-fade-in"
            words={report.keywords}
          />
        )}
      </header>

      <div className="mt-10" aria-live="polite" aria-busy={isWriting}>
        {error && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive-soft p-4 text-sm">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium text-destructive">{error}</p>
              <Button size="sm" variant="neutral" className="mt-2" onClick={write}>
                Try again
              </Button>
            </div>
          </div>
        )}

        {!report ? (
          isWriting && <ReportSkeleton />
        ) : (
          <div className="space-y-12 animate-fade-in">
            <p className="max-w-3xl text-lg leading-relaxed sm:text-xl">{report.summary}</p>

            <section aria-labelledby="fit-heading">
              <h2 id="fit-heading" className="font-display text-2xl font-semibold">Why this fits you</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {report.circles.map((c) => {
                  const meta = circleById[c.circle];
                  return (
                    <li key={c.circle} className="rounded-2xl border border-border bg-card p-5" style={{ borderTopColor: meta?.color, borderTopWidth: 3 }}>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: meta?.color }}>
                        {meta?.label}
                      </p>
                      <p className="mt-2">{c.insight}</p>
                      {c.evidence && (
                        <p className="mt-3 border-l-2 pl-3 text-sm italic text-muted-foreground" style={{ borderColor: meta?.color }}>
                          {c.evidence}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-labelledby="edge-heading" className="grid gap-4 lg:grid-cols-2">
              <Card className="p-6">
                <h2 id="edge-heading" className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Sprout className="size-5 text-success" aria-hidden="true" /> Your growth edge
                </h2>
                <p className="mt-1 text-sm font-medium" style={{ color: circleById[report.growthEdge.circle]?.color }}>
                  {circleById[report.growthEdge.circle]?.label}
                </p>
                <p className="mt-3">{report.growthEdge.advice}</p>
              </Card>

              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Footprints className="size-5 text-primary" aria-hidden="true" /> Try this week
                </h2>
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
              </Card>
            </section>

            <section aria-labelledby="paths-heading">
              <h2 id="paths-heading" className="flex items-center gap-2 font-display text-2xl font-semibold">
                <Compass className="size-5 text-primary" aria-hidden="true" /> Paths to explore
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {report.paths.map((p) => (
                  <li key={p.title} className="rounded-2xl border border-border bg-card p-5">
                    <p className="font-medium">{p.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.why}</p>
                  </li>
                ))}
              </ul>
            </section>

            <Button
              variant="ghost"
              size="sm"
              onClick={write}
              isLoading={isWriting}
              loadingText="Rewriting…"
              leftIcon={<RotateCw className="size-4" aria-hidden="true" />}
            >
              Rewrite insights
            </Button>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-background/95 backdrop-blur sm:bottom-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <ButtonLink href="/generate-ikigai" variant="ghost">
            <ArrowLeft className="size-4" aria-hidden="true" /> Ideas
          </ButtonLink>
          <ButtonLink href="/generate-ikigai/card" size="lg">
            Design my card <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
