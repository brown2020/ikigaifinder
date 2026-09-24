"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Blend, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Input";
import { useIkigaiGenerator } from "@/hooks/use-ikigai-generator";
import { useIkigaiStore } from "@/zustand";
import { displayStatement, isSameStatement } from "@/utils/ikigaiList";
import { REFINE_PRESETS } from "@/constants/questions";
import { firstIncompleteSection, firstUnstartedSection, isSectionStarted } from "@/utils/journey";
import { cn } from "@/utils/cn";
import type { IkigaiData } from "@/types";
import JourneyProgress from "./JourneyProgress";
import ShortlistCompare from "./ShortlistCompare";
import StatementCard from "./StatementCard";

function StatementSkeleton() {
  return (
    <li className="rounded-2xl border border-border bg-card p-6" aria-hidden="true">
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="mt-2 h-5 w-3/5" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
    </li>
  );
}

export default function IdeasStep(): React.ReactElement {
  const router = useRouter();
  const ikigai = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const isSaving = useIkigaiStore((s) => s.isSaving);

  const [options, setOptions] = useState<IkigaiData[]>(ikigai.ikigaiOptions);
  const [selected, setSelected] = useState<IkigaiData | null>(ikigai.ikigaiSelected);
  const [guidance, setGuidance] = useState(ikigai.ikigaiGuidance);
  const [shortlist, setShortlist] = useState<IkigaiData[]>(ikigai.ikigaiShortlist ?? []);
  const [view, setView] = useState<"all" | "shortlist">("all");
  const { generate, isGenerating, error, clearError } = useIkigaiGenerator(setOptions);

  const missingSection = firstUnstartedSection(ikigai.answers);
  const sharpenSection = firstIncompleteSection(ikigai.answers);
  const autoStarted = useRef(false);

  const runGeneration = useCallback(
    /** `remembered` is the typed guidance to keep; one-tap steers aren't saved over it. */
    async (current: IkigaiData[], steer: string, remembered = steer) => {
      const result = await generate({ answers: ikigai.answers, current, guidance: steer });
      if (result) void updateIkigai({ ikigaiOptions: result, ikigaiGuidance: remembered });
    },
    [generate, ikigai.answers, updateIkigai]
  );

  useEffect(() => {
    if (autoStarted.current || missingSection || options.length > 0) return;
    autoStarted.current = true;
    void runGeneration([], guidance);
  }, [missingSection, options.length, guidance, runGeneration]);

  const handleEdit = (item: IkigaiData, text: string) => {
    const edited = { ...item, ikigai: text };
    setOptions((list) => list.map((o) => (o === item ? edited : o)));
    setShortlist((list) => list.map((o) => (isSameStatement(o, item) ? edited : o)));
    setSelected(edited);
  };

  const isShortlisted = (item: IkigaiData) => shortlist.some((o) => isSameStatement(o, item));

  const toggleShortlist = (item: IkigaiData) => {
    const next = isShortlisted(item) ? shortlist.filter((o) => !isSameStatement(o, item)) : [...shortlist, item];
    setShortlist(next);
    if (next.length === 0) setView("all");
    void updateIkigai({ ikigaiShortlist: next });
  };

  const blendShortlist = () => {
    setView("all");
    const list = shortlist.map((o) => `- ${displayStatement(o.ikigai)}`).join("\n");
    void runGeneration(options, `Blend the strongest parts of these statements I shortlisted into new ones:\n${list}`, guidance);
  };

  const handleContinue = async () => {
    if (!selected) return;
    const ok = await updateIkigai({
      ikigaiOptions: options,
      ikigaiSelected: selected,
      ikigaiGuidance: guidance,
      ikigaiShortlist: shortlist,
    });
    if (ok) router.push("/generate-ikigai/report");
    else toast.error("We couldn't save your choice. Please try again.");
  };

  if (missingSection) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <Eyebrow>Almost there</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold">Finish your answers first</h1>
        <p className="mt-3 text-muted-foreground">
          Your ideas draw on all four circles, so each one needs at least one answer.
        </p>
        <ButtonLink
          href={ikigai.answers.some(isSectionStarted) ? `/ikigai-finder?step=${missingSection}` : "/ikigai-finder/quick"}
          className="mt-8"
          size="lg"
        >
          {ikigai.answers.some(isSectionStarted) ? `Continue part ${missingSection}` : "Answer four quick questions"}
        </ButtonLink>
      </div>
    );
  }

  const showInitialSkeleton = isGenerating && options.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-32 pt-8 sm:px-8 sm:pt-10">
      <JourneyProgress current="ideas" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14">
        <header className="lg:col-start-1 lg:row-start-1">
          <Eyebrow>Your ideas</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Which one sounds like you?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Each statement blends your four circles differently. Pick the one that resonates, then tweak its wording if you like.
          </p>
        </header>


        <section aria-label="Ikigai statements" aria-busy={isGenerating} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {error && (
            <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive-soft p-4 text-sm">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-medium text-destructive">{error}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="neutral" onClick={() => runGeneration(options, guidance)}>
                    Try again
                  </Button>
                  <Button size="sm" variant="ghost" onClick={clearError}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}

          {shortlist.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Which ideas to show">
              {(["all", "shortlist"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "h-9 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    view === v ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {v === "all" ? `All ideas (${options.length})` : `Shortlist (${shortlist.length})`}
                </button>
              ))}
              {view === "shortlist" && shortlist.length > 1 && (
                <Button size="sm" variant="neutral" className="ml-auto" onClick={blendShortlist} disabled={isGenerating} leftIcon={<Blend className="size-4" aria-hidden="true" />}>
                  Blend these
                </Button>
              )}
            </div>
          )}

          {view === "shortlist" ? (
            <div className="space-y-4">
              {shortlist.length > 1 && <ShortlistCompare items={shortlist} />}
              <ul className="space-y-4">
                {shortlist.map((item) => (
                  <StatementCard
                    key={item.ikigai}
                    item={item}
                    selected={isSameStatement(item, selected)}
                    onSelect={() => setSelected(item)}
                    onEdit={(text) => handleEdit(item, text)}
                    shortlisted
                    onToggleShortlist={() => toggleShortlist(item)}
                  />
                ))}
              </ul>
            </div>
          ) : options.length === 0 && !isGenerating && !error ? (
            <div className="rounded-2xl border border-dashed border-border-strong p-12 text-center">
              <Sparkles className="mx-auto size-8 text-primary" aria-hidden="true" />
              <p className="mt-3 font-display text-xl">No ideas yet</p>
              <p className="mt-1 text-muted-foreground">Generate a batch to see statements drawn from your answers.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {options.map((item) => (
                <StatementCard
                  key={item.ikigai}
                  item={item}
                  selected={isSameStatement(item, selected)}
                  onSelect={() => setSelected(item)}
                  onEdit={(text) => handleEdit(item, text)}
                  onMoreLikeThis={() =>
                    runGeneration(
                      options,
                      `Write close variations of this statement, keeping its core idea but changing the audience, format, or scale: "${displayStatement(item.ikigai)}"`,
                      guidance
                    )
                  }
                  busy={isGenerating}
                  shortlisted={isShortlisted(item)}
                  onToggleShortlist={() => toggleShortlist(item)}
                />
              ))}
              {isGenerating && (showInitialSkeleton ? [0, 1, 2] : [0]).map((i) => <StatementSkeleton key={`s${i}`} />)}
            </ul>
          )}
          <p className="sr-only" aria-live="polite">
            {isGenerating ? "Generating ideas" : `${options.length} ideas available`}
          </p>
        </section>

        <aside className="lg:sticky lg:top-28 lg:col-start-1 lg:row-start-2 lg:self-start">
          <Card className="p-5">
            <p className="text-sm font-medium" id="refine-label">Refine with one tap</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="refine-label">
              {REFINE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => runGeneration(options, preset.guidance, guidance)}
                  className="h-8 rounded-full border border-border-strong bg-card px-3 text-sm transition-colors hover:border-primary/60 hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="my-5 border-t border-border" />
            <Textarea
              id="ikigai-guidance"
              label="Steer the next batch"
              helperText="Optional. For example: more hands-on, focused on education, works remotely."
              placeholder="What should the next ideas lean toward?"
              value={guidance}
              maxLength={500}
              onChange={(e) => setGuidance(e.target.value)}
              className="min-h-20"
            />
            <Button
              variant="secondary"
              fullWidth
              className="mt-4"
              isLoading={isGenerating}
              loadingText="Writing ideas…"
              leftIcon={<Sparkles className="size-4" aria-hidden="true" />}
              onClick={() => runGeneration(options, guidance)}
            >
              {options.length ? "Generate more ideas" : "Generate ideas"}
            </Button>
          </Card>
          {sharpenSection && (
            <Card className="mt-4 p-5">
              <p className="font-medium">Want sharper ideas?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                These come from a few answers. The full reflection adds twelve more questions, and new ideas will draw on everything you write.
              </p>
              <ButtonLink href={`/ikigai-finder?step=${sharpenSection}`} variant="neutral" size="sm" className="mt-4">
                Go deeper <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </Card>
          )}
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-background/95 backdrop-blur sm:bottom-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <ButtonLink href="/ikigai-finder?step=4" variant="ghost">
            <ArrowLeft className="size-4" aria-hidden="true" /> Answers
          </ButtonLink>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selected || isGenerating}
            isLoading={isSaving}
            loadingText="Saving…"
            rightIcon={<ArrowRight className="size-4" aria-hidden="true" />}
          >
            {selected ? "See my insights" : "Select a statement"}
          </Button>
        </div>
      </div>
    </div>
  );
}
