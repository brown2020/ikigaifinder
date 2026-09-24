"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fieldClasses } from "@/components/ui/Input";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import { CIRCLE_BY_STEP } from "@/constants/ikigai";
import { QUICK_QUESTION_IDS } from "@/constants/questions";
import { useAuthStore, useIkigaiStore, useUIStore } from "@/zustand";
import { SIGN_UP_PROMPT } from "@/utils/journey";
import { cn } from "@/utils/cn";

type FormValues = Record<string, string>;

/** One question per circle: the shortest path to a first set of ideas. */
export default function QuickQuestionnaire(): React.ReactElement {
  const router = useRouter();
  const stored = useIkigaiStore((s) => s.ikigaiData.answers);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const isSaving = useIkigaiStore((s) => s.isSaving);
  const isGuest = !useAuthStore((s) => s.uid);
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  const items = stored.flatMap((section) => {
    const question = section.questions.find((q) => q.id === QUICK_QUESTION_IDS[section.id]);
    const circle = CIRCLE_BY_STEP[section.id as keyof typeof CIRCLE_BY_STEP];
    return question && circle ? [{ section, question, circle }] : [];
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: Object.fromEntries(
      items.map(({ question }) => [String(question.id), (question.answer ?? []).join("\n")])
    ),
    mode: "onTouched",
  });

  const onSubmit = async (values: FormValues) => {
    let changed = false;
    const answers = stored.map((section) => ({
      ...section,
      questions: section.questions.map((q) => {
        if (q.id !== QUICK_QUESTION_IDS[section.id]) return q;
        const text = (values[String(q.id)] ?? "").trim();
        if (text !== (q.answer ?? []).join("\n")) changed = true;
        return { ...q, answer: text ? [text] : [] };
      }),
    }));

    if (changed && !(await updateIkigai({ answers, ikigaiOptions: [] }))) {
      toast.error("We couldn't save your answers. Check your connection and try again.");
      return;
    }
    if (isGuest) openAuthModal("/generate-ikigai", SIGN_UP_PROMPT);
    else router.push("/generate-ikigai");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Quick start · about 2 minutes</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Four questions, one per circle
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            A sentence or two each is plenty. You&apos;ll get ideas right away and can go deeper later to sharpen them.
          </p>
          {isGuest && (
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              No account needed yet. Your answers stay on this device until you sign up to see your ideas.
            </p>
          )}
          <div className="mt-8 hidden max-w-[300px] lg:block">
            <IkigaiDiagram showLabels centerActive={false} />
          </div>
        </aside>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card className="divide-y divide-border">
            {items.map(({ question, circle }) => {
              const id = String(question.id);
              const error = errors[id]?.message;
              return (
                <div key={id} className="p-6 sm:p-8">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: circle.color }}>
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: circle.color }} aria-hidden="true" />
                    {circle.label}
                  </p>
                  <label htmlFor={id} className="mt-3 block font-display text-lg font-medium leading-snug sm:text-xl">
                    {question.label}
                  </label>
                  <textarea
                    id={id}
                    rows={3}
                    placeholder={question.placeholder}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={cn(fieldClasses, "mt-4 min-h-24 resize-y py-3 leading-relaxed [field-sizing:content]")}
                    {...register(id, {
                      validate: (v) => v.trim().length > 0 || "Please add an answer.",
                      maxLength: { value: 2000, message: "Please keep this under 2,000 characters." },
                    })}
                  />
                  {error && (
                    <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </Card>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <ButtonLink href="/ikigai-finder?step=1" variant="ghost">
              Take the full reflection instead
            </ButtonLink>
            <Button
              type="submit"
              size="lg"
              isLoading={isSaving}
              loadingText="Saving…"
              rightIcon={<ArrowRight className="size-4" aria-hidden="true" />}
            >
              Show my ideas
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
