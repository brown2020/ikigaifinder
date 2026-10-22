"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Blend, Eraser, Sparkles } from "lucide-react";
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
import type { Ikigai, IkigaiData, QuestionStep } from "@/types";
import JourneyProgress from "./JourneyProgress";
import ShortlistCompare from "./ShortlistCompare";
import StatementCard from "./StatementCard";

type Steer = (steer: string) => void;

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

/** Owns the idea list, streaming batches into it newest-first and remembering where the latest batch ends. */
function useIdeaList(
  answers: QuestionStep[],
  initialOptions: IkigaiData[],
  initialGuidance: string,
  canStart: boolean,
  listRef: React.RefObject<HTMLElement | null>
) {
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const [options, setOptions] = useState<IkigaiData[]>(initialOptions);
  const [guidance, setGuidance] = useState(initialGuidance);
  /** Length of the list before the latest batch; new statements are merged ahead of it. */
  const [previousCount, setPreviousCount] = useState<number | null>(null);
  const { generate, isGenerating, error, clearError } = useIkigaiGenerator(setOptions);
  const autoStarted = useRef(false);

  const run = useCallback(
    /** `remembered` is the typed guidance to keep; one-tap steers aren't saved over it. */
    async (current: IkigaiData[], steer: string, remembered = steer) => {
      setPreviousCount(current.length > 0 ? current.length : null);
      const list = listRef.current;
      if (current.length > 0 && list && list.getBoundingClientRect().top < 0) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        list.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
      const result = await generate({ answers, current, guidance: steer });
      if (result) void updateIkigai({ ikigaiOptions: result, ikigaiGuidance: remembered });
    },
    [generate, answers, updateIkigai, listRef]
  );

  useEffect(() => {
    if (autoStarted.current || !canStart || options.length > 0) return;
    autoStarted.current = true;
    void run([], guidance);
  }, [canStart, options.length, guidance, run]);

  /** Runs a one-off steer without replacing the person's typed guidance. */
  const steer: Steer = (text) => void run(options, text, guidance);
  const generateMore = () => void run(options, guidance);

  const keepOnly = (kept: IkigaiData[]) => {
    setOptions(kept);
    setPreviousCount(null);
    void updateIkigai({ ikigaiOptions: kept });
  };

  const freshCount = Math.max(0, options.length - (previousCount ?? 0));
  return {
    options, setOptions, guidance, setGuidance, isGenerating, error, clearError,
    steer, generateMore, keepOnly, freshCount, newCount: previousCount === null ? 0 : freshCount,
  };
}

export default function IdeasStep(): React.ReactElement {
  const router = useRouter();
  const ikigai = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const isSaving = useIkigaiStore((s) => s.isSaving);
  const missingSection = firstUnstartedSection(ikigai.answers);
  const listRef = useRef<HTMLElement>(null);
  const ideas = useIdeaList(ikigai.answers, ikigai.ikigaiOptions, ikigai.ikigaiGuidance, !missingSection, listRef);
  const [selected, setSelected] = useState<IkigaiData | null>(ikigai.ikigaiSelected);
  const [shortlist, setShortlist] = useState<IkigaiData[]>(ikigai.ikigaiShortlist ?? []);
  const [view, setView] = useState<"all" | "shortlist">("all");

  const isShortlisted = (item: IkigaiData) => shortlist.some((o) => isSameStatement(o, item));

  const handleEdit = (item: IkigaiData, text: string) => {
    const edited = { ...item, ikigai: text };
    ideas.setOptions((list) => list.map((o) => (o === item ? edited : o)));
    setShortlist((list) => list.map((o) => (isSameStatement(o, item) ? edited : o)));
    setSelected(edited);
  };

  const toggleShortlist = (item: IkigaiData) => {
    const next = isShortlisted(item) ? shortlist.filter((o) => !isSameStatement(o, item)) : [...shortlist, item];
    setShortlist(next);
    if (next.length === 0) setView("all");
    void updateIkigai({ ikigaiShortlist: next });
  };

  const blendShortlist = () => {
    setView("all");
    ideas.steer(`Blend the strongest parts of these statements I shortlisted into new ones:\n${shortlist.map((o) => `- ${displayStatement(o.ikigai)}`).join("\n")}`);
  };

  const kept = ideas.options.filter((o) => isShortlisted(o) || isSameStatement(o, selected));
  const clearIdeas = () => {
    if (window.confirm("Clear these ideas? Your shortlist and current choice stay.")) ideas.keepOnly(kept);
  };

  const handleContinue = async () => {
    if (!selected) return;
    const ok = await updateIkigai({
      ikigaiOptions: ideas.options,
      ikigaiSelected: selected,
      ikigaiGuidance: ideas.guidance,
      ikigaiShortlist: shortlist,
      ...selectionHistory(ikigai, selected),
    });
    if (ok) router.push("/generate-ikigai/report");
    else toast.error("We couldn't save your choice. Please try again.");
  };

  if (missingSection) return <MissingAnswers answers={ikigai.answers} section={missingSection} />;

  const card = (item: IkigaiData, isNew: boolean, inShortlistView = false) => (
    <StatementCard
      key={item.ikigai}
      item={item}
      isNew={isNew}
      selected={isSameStatement(item, selected)}
      onSelect={() => setSelected(item)}
      onEdit={(text) => handleEdit(item, text)}
      onMoreLikeThis={inShortlistView ? undefined : () => ideas.steer(`Write close variations of this statement, keeping its core idea but changing the audience, format, or scale: "${displayStatement(item.ikigai)}"`)}
      busy={ideas.isGenerating}
      shortlisted={inShortlistView || isShortlisted(item)}
      onToggleShortlist={() => toggleShortlist(item)}
    />
  );

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

        <section ref={listRef} aria-label="Ikigai statements" aria-busy={ideas.isGenerating} className="scroll-mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {ideas.error && <GenerationError message={ideas.error} onRetry={ideas.generateMore} onDismiss={ideas.clearError} />}
          {shortlist.length > 0 && (
            <ViewToggle
              view={view}
              onView={setView}
              counts={{ all: ideas.options.length, shortlist: shortlist.length }}
              onBlend={shortlist.length > 1 ? blendShortlist : undefined}
              busy={ideas.isGenerating}
            />
          )}
          {view === "shortlist" ? (
            <ShortlistView items={shortlist} renderCard={(item) => card(item, false, true)} />
          ) : (
            <AllIdeas
              options={ideas.options}
              freshCount={ideas.freshCount}
              newCount={ideas.newCount}
              isGenerating={ideas.isGenerating}
              hasError={Boolean(ideas.error)}
              renderCard={card}
            />
          )}
        </section>

        <aside className="lg:sticky lg:top-28 lg:col-start-1 lg:row-start-2 lg:self-start">
          <RefinePanel
            guidance={ideas.guidance}
            onGuidance={ideas.setGuidance}
            onSteer={ideas.steer}
            onGenerate={ideas.generateMore}
            busy={ideas.isGenerating}
            hasIdeas={ideas.options.length > 0}
            onClear={ideas.options.length > kept.length ? clearIdeas : undefined}
          />
          <SharpenCard section={firstIncompleteSection(ikigai.answers)} />
        </aside>
      </div>

      <div data-bottom-bar="always" className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-background/95 backdrop-blur sm:bottom-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <ButtonLink href="/ikigai-finder?step=4" variant="ghost">
            <ArrowLeft className="size-4" aria-hidden="true" /> Answers
          </ButtonLink>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selected || ideas.isGenerating}
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

/** Choosing a different statement records when, and moves the previous one into history. */
function selectionHistory(ikigai: Ikigai, selected: IkigaiData) {
  const previous = ikigai.ikigaiSelected;
  if (isSameStatement(previous, selected)) return {};
  const now = new Date().toISOString();
  const history = ikigai.ikigaiHistory ?? [];
  return {
    ikigaiSelectedAt: now,
    ikigaiHistory: previous
      ? [...history, { ...previous, chosenAt: ikigai.ikigaiSelectedAt ?? null, replacedAt: now }].slice(-20)
      : history,
  };
}

function liveStatus(isGenerating: boolean, newCount: number, total: number): string {
  if (isGenerating) return "Generating ideas";
  if (newCount > 0) return `${newCount} new ${newCount === 1 ? "idea" : "ideas"} added at the top. ${total} ideas in total.`;
  return `${total} ideas available`;
}

function MissingAnswers({ answers, section }: { answers: QuestionStep[]; section: number }) {
  const started = answers.some(isSectionStarted);
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <Eyebrow>Almost there</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-semibold">Finish your answers first</h1>
      <p className="mt-3 text-muted-foreground">
        Your ideas draw on all four circles, so each one needs at least one answer.
      </p>
      <ButtonLink href={started ? `/ikigai-finder?step=${section}` : "/ikigai-finder/quick"} className="mt-8" size="lg">
        {started ? `Continue part ${section}` : "Answer four quick questions"}
      </ButtonLink>
    </div>
  );
}

function GenerationError({ message, onRetry, onDismiss }: { message: string; onRetry: () => void; onDismiss: () => void }) {
  return (
    <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive-soft p-4 text-sm">
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-medium text-destructive">{message}</p>
        <div className="mt-2 flex gap-2">
          <Button size="sm" variant="neutral" onClick={onRetry}>
            Try again
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ view, onView, counts, onBlend, busy }: {
  view: "all" | "shortlist";
  onView: (view: "all" | "shortlist") => void;
  counts: { all: number; shortlist: number };
  onBlend?: () => void;
  busy: boolean;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Which ideas to show">
      {(["all", "shortlist"] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={view === v}
          onClick={() => onView(v)}
          className={cn(
            "h-9 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            view === v ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {v === "all" ? `All ideas (${counts.all})` : `Shortlist (${counts.shortlist})`}
        </button>
      ))}
      {view === "shortlist" && onBlend && (
        <Button size="sm" variant="neutral" className="ml-auto" onClick={onBlend} disabled={busy} leftIcon={<Blend className="size-4" aria-hidden="true" />}>
          Blend these
        </Button>
      )}
    </div>
  );
}

function ShortlistView({ items, renderCard }: { items: IkigaiData[]; renderCard: (item: IkigaiData) => React.ReactNode }) {
  return (
    <div className="space-y-4">
      {items.length > 1 && <ShortlistCompare items={items} />}
      <ul className="space-y-4">{items.map(renderCard)}</ul>
    </div>
  );
}

function AllIdeas({ options, freshCount, newCount, isGenerating, hasError, renderCard }: {
  options: IkigaiData[];
  freshCount: number;
  newCount: number;
  isGenerating: boolean;
  hasError: boolean;
  renderCard: (item: IkigaiData, isNew: boolean) => React.ReactNode;
}) {
  if (options.length === 0 && !isGenerating && !hasError) return <EmptyIdeas />;
  return (
    <>
      <ul className="space-y-4">
        {options.slice(0, freshCount).map((item) => renderCard(item, newCount > 0))}
        {isGenerating && (options.length === 0 ? [0, 1, 2] : [0]).map((i) => <StatementSkeleton key={`s${i}`} />)}
        {options.slice(freshCount).map((item) => renderCard(item, false))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {liveStatus(isGenerating, newCount, options.length)}
      </p>
    </>
  );
}

function EmptyIdeas() {
  return (
    <div className="rounded-2xl border border-dashed border-border-strong p-12 text-center">
      <Sparkles className="mx-auto size-8 text-primary" aria-hidden="true" />
      <p className="mt-3 font-display text-xl">No ideas yet</p>
      <p className="mt-1 text-muted-foreground">Generate a batch to see statements drawn from your answers.</p>
    </div>
  );
}

function RefinePanel({ guidance, onGuidance, onSteer, onGenerate, busy, hasIdeas, onClear }: {
  guidance: string;
  onGuidance: (value: string) => void;
  onSteer: Steer;
  onGenerate: () => void;
  busy: boolean;
  hasIdeas: boolean;
  onClear?: () => void;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium" id="refine-label">Refine with one tap</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="refine-label">
        {REFINE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            disabled={busy}
            onClick={() => onSteer(preset.guidance)}
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
        onChange={(e) => onGuidance(e.target.value)}
        className="min-h-20"
      />
      <Button
        variant="secondary"
        fullWidth
        className="mt-4"
        isLoading={busy}
        loadingText="Writing ideas…"
        leftIcon={<Sparkles className="size-4" aria-hidden="true" />}
        onClick={onGenerate}
      >
        {hasIdeas ? "Generate more ideas" : "Generate ideas"}
      </Button>
      {onClear && (
        <Button variant="ghost" size="sm" fullWidth className="mt-2" disabled={busy} onClick={onClear} leftIcon={<Eraser className="size-4" aria-hidden="true" />}>
          Clear ideas
        </Button>
      )}
    </Card>
  );
}

function SharpenCard({ section }: { section: number | null }) {
  if (!section) return null;
  return (
    <Card className="mt-4 p-5">
      <p className="font-medium">Want sharper ideas?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        These come from a few answers. The full reflection adds twelve more questions, and new ideas will draw on everything you write.
      </p>
      <ButtonLink href={`/ikigai-finder?step=${section}`} variant="neutral" size="sm" className="mt-4">
        Go deeper <ArrowRight className="size-4" aria-hidden="true" />
      </ButtonLink>
    </Card>
  );
}
