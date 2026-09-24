"use client";

import Image from "next/image";
import { ArrowRight, Palette, RefreshCcw, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Skeleton } from "@/components/ui/Skeleton";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import ScoreBars from "@/components/ikigai/ScoreBars";
import SharePanel from "@/components/share/SharePanel";
import { CIRCLE_BY_STEP, type CircleId } from "@/constants/ikigai";
import { useIkigaiStore, useProfileStore } from "@/zustand";
import { displayStatement } from "@/utils/ikigaiList";
import { canGenerate, isSectionComplete, isSectionStarted, resumeHref } from "@/utils/journey";
import type { IkigaiSummary } from "@/types";

interface DashboardPageProps {
  userId: string;
  initial: IkigaiSummary;
}

function Greeting() {
  const firstName = useProfileStore((s) => s.profile.firstName);
  return <Eyebrow>{firstName ? `Welcome back, ${firstName}` : "Welcome back"}</Eyebrow>;
}

export default function DashboardPage({ userId, initial }: DashboardPageProps): React.ReactElement {
  const ikigai = useIkigaiStore((s) => s.ikigaiData);
  const status = useIkigaiStore((s) => s.status);
  const ready = status === "ready";

  const coverImage = (ready && ikigai.ikigaiCoverImage) || initial.coverImage;
  const selected = ready ? ikigai.ikigaiSelected : null;
  const statement = selected ? displayStatement(selected.ikigai) : initial.statement;

  if (coverImage) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-[0_24px_60px_-30px_rgba(31,26,23,0.45)]">
              <Image src={coverImage} alt={statement ? `Ikigai card: ${statement}` : "My ikigai card"} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" priority />
            </div>
          </div>

          <div>
            <Greeting />
            <h1 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-[2rem]">
              {statement ?? "Your ikigai"}
            </h1>
            {selected ? (
              <ScoreBars scores={selected} className="mt-6" />
            ) : !ready ? (
              <Skeleton className="mt-6 h-10 w-full" />
            ) : null}

            <SharePanel className="mt-8" userId={userId} coverImage={coverImage} initialSharable={initial.sharable} />

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { href: "/generate-ikigai/card", label: "Redesign card", icon: Palette },
                { href: "/generate-ikigai", label: "Explore ideas", icon: Sparkles },
                { href: "/ikigai-finder?step=1", label: "Revisit answers", icon: RefreshCcw },
              ].map((action) => (
                <ButtonLink key={action.href} href={action.href} variant="neutral" size="sm">
                  <action.icon className="size-4" aria-hidden="true" /> {action.label}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-16" role="status" aria-label="Loading">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-10 w-3/4" />
        <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const active: Partial<Record<CircleId, boolean>> = {};
  ikigai.answers.forEach((step) => {
    const circle = CIRCLE_BY_STEP[step.id as keyof typeof CIRCLE_BY_STEP];
    if (circle) active[circle.id] = isSectionComplete(step);
  });
  const doneCount = Object.values(active).filter(Boolean).length;
  const started = ikigai.answers.some(isSectionStarted);

  const stage = !started
    ? { title: "Let's find your ikigai", body: "Start with four quick questions, one for each circle: what you love, what you're good at, what the world needs, and what you can be paid for. Your first ideas take about two minutes.", cta: "Begin" }
    : !canGenerate(ikigai.answers)
      ? { title: "Pick up where you left off", body: `You've completed ${doneCount} of 4 parts. Your answers are saved as you go.`, cta: "Continue" }
      : !ikigai.ikigaiSelected
        ? { title: "Your ideas are ready to explore", body: "Your answers are complete. Choose the ikigai statement that sounds most like you.", cta: "See my ideas" }
        : { title: "One last step: your card", body: "Turn your statement into a card you can keep, download, or share.", cta: "Design my card" };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <Card className="grid items-center gap-8 overflow-hidden p-6 sm:p-10 md:grid-cols-[1fr_280px]">
        <div>
          <Greeting />
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{stage.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{stage.body}</p>
          {ikigai.ikigaiSelected && (
            <blockquote className="mt-6 border-l-2 border-primary pl-4 font-display text-lg">
              {displayStatement(ikigai.ikigaiSelected.ikigai)}
            </blockquote>
          )}
          <ButtonLink href={resumeHref(ikigai)} size="lg" className="mt-8">
            {stage.cta} <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
        <IkigaiDiagram
          className="mx-auto max-w-[260px]"
          active={active}
          centerActive={Boolean(ikigai.ikigaiSelected)}
          showLabels
        />
      </Card>
    </div>
  );
}
