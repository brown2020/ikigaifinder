"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fieldClasses } from "@/components/ui/Input";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import { CIRCLE_BY_STEP, type CircleId } from "@/constants/ikigai";
import { useIkigaiStore } from "@/zustand";
import { firstIncompleteSection, isSectionComplete, type JourneyStepKey } from "@/utils/journey";
import { cn } from "@/utils/cn";
import type { QuestionStep } from "@/types";
import JourneyProgress from "./JourneyProgress";
import TagInput from "./TagInput";

type FormValues = Record<string, string | string[]>;

function toFormValues(steps: QuestionStep[]): FormValues {
  const values: FormValues = {};
  steps.forEach((step) =>
    step.questions.forEach((q) => {
      const answer = q.answer ?? [];
      values[String(q.id)] = q.type === "select-tags" ? answer : answer.join("\n");
    })
  );
  return values;
}

function toAnswer(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean);
  const text = (value ?? "").trim();
  return text ? [text] : [];
}

function sameAnswers(a: QuestionStep[], b: QuestionStep[]): boolean {
  const flat = (steps: QuestionStep[]) =>
    JSON.stringify(steps.flatMap((s) => s.questions.map((q) => [q.id, q.answer ?? []])));
  return flat(a) === flat(b);
}

function clampStep(raw: string | null, fallback: number, total: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= total ? n : fallback;
}

export default function Questionnaire(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stored = useIkigaiStore((s) => s.ikigaiData.answers);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const isSaving = useIkigaiStore((s) => s.isSaving);

  const total = stored.length;
  const [step, setStep] = useState(() =>
    clampStep(searchParams.get("step"), firstIncompleteSection(stored) ?? 1, total)
  );
  const section = stored[step - 1];
  const circle = CIRCLE_BY_STEP[section.id as keyof typeof CIRCLE_BY_STEP];

  const defaultValues = useMemo(() => toFormValues(stored), [stored]);
  const { control, register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>({
    defaultValues,
    mode: "onTouched",
  });

  const activeCircles = useMemo(() => {
    const map: Partial<Record<CircleId, boolean>> = {};
    stored.forEach((s) => {
      const c = CIRCLE_BY_STEP[s.id as keyof typeof CIRCLE_BY_STEP];
      if (c) map[c.id] = isSectionComplete(s);
    });
    return map;
  }, [stored]);

  const buildAnswers = (values: FormValues): QuestionStep[] =>
    stored.map((s) => ({
      ...s,
      questions: s.questions.map((q) => ({ ...q, answer: toAnswer(values[String(q.id)]) })),
    }));

  const goTo = (next: number) => {
    setStep(next);
    router.replace(`/ikigai-finder?step=${next}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (values: FormValues) => {
    const answers = buildAnswers(values);
    const changed = !sameAnswers(answers, stored);
    const isLast = step === total;

    if (changed) {
      const allDone = answers.every(isSectionComplete);
      // New answers deserve fresh ideas; a card made from old ideas stays on the dashboard.
      const ok = await updateIkigai(
        allDone && isLast ? { answers, ikigaiOptions: [], ikigaiSelected: null } : { answers }
      );
      if (!ok) {
        toast.error("We couldn't save your answers. Check your connection and try again.");
        return;
      }
    }

    if (isLast) router.push("/generate-ikigai");
    else goTo(step + 1);
  };

  const onBack = async () => {
    const answers = buildAnswers(getValues());
    if (!sameAnswers(answers, stored)) void updateIkigai({ answers });
    goTo(step - 1);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
      <JourneyProgress current={section.id as JourneyStepKey} onSelectSection={goTo} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow style={{ color: circle?.color }}>Part {step} of {total}</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {section.title}
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">{section.description}</p>
          <div className="mt-8 hidden max-w-[300px] lg:block">
            <IkigaiDiagram active={activeCircles} highlight={circle?.id} centerActive={false} showLabels />
          </div>
        </aside>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card className="divide-y divide-border">
            {section.questions.map((q, i) => {
              const id = String(q.id);
              const error = errors[id]?.message as string | undefined;
              const describedBy = error ? `${id}-error` : undefined;
              return (
                <div key={id} className="p-6 sm:p-8">
                  <label id={`${id}-label`} htmlFor={id} className="flex gap-3 font-display text-lg font-medium leading-snug sm:text-xl">
                    <span className="mt-0.5 text-sm font-sans font-semibold tabular-nums" style={{ color: circle?.color }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{q.label}</span>
                  </label>
                  <div className="mt-4 sm:pl-8">
                    {q.type === "select-tags" ? (
                      <Controller
                        name={id}
                        control={control}
                        rules={{
                          validate: (v) =>
                            (Array.isArray(v) && v.length > 0) || String(q.validation.required),
                        }}
                        render={({ field }) => (
                          <TagInput
                            id={id}
                            value={Array.isArray(field.value) ? field.value : []}
                            onChange={field.onChange}
                            suggestions={q.options ?? []}
                            max={q.validation.maxLength}
                            placeholder={q.placeholder}
                            invalid={Boolean(error)}
                            describedBy={describedBy}
                          />
                        )}
                      />
                    ) : (
                      <textarea
                        id={id}
                        rows={3}
                        placeholder={q.placeholder}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        className={cn(fieldClasses, "min-h-24 resize-y py-3 leading-relaxed [field-sizing:content]")}
                        {...register(id, {
                          validate: (v) =>
                            (typeof v === "string" && v.trim().length > 0) || String(q.validation.required),
                          maxLength: { value: 2000, message: "Please keep this under 2,000 characters." },
                        })}
                      />
                    )}
                    {error && (
                      <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
                        {error}
                      </p>
                    )}
                    {q.type === "select-tags" && !error && q.validation.message && (
                      <p className="mt-2 text-sm text-muted-foreground">{q.validation.message}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={step === 1}
              leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
            >
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              isLoading={isSaving}
              loadingText="Saving…"
              rightIcon={<ArrowRight className="size-4" aria-hidden="true" />}
            >
              {section.button || `Continue to part ${step + 1}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
