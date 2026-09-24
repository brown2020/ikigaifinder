"use client";

import { useId, useState } from "react";
import { Lightbulb, Mic, MicOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { fieldClasses } from "@/components/ui/Input";
import { useSpeechInput } from "@/hooks/use-speech-input";
import { cn } from "@/utils/cn";

interface AnswerFieldProps {
  id: string;
  registration: UseFormRegisterReturn;
  /** Appends dictated text to the answer. */
  onDictate: (text: string) => void;
  placeholder?: string;
  hints?: string[];
  error?: string;
  className?: string;
}

const toolClasses =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** A written answer with optional "stuck?" prompts and dictation. */
export default function AnswerField({ id, registration, onDictate, placeholder, hints, error, className }: AnswerFieldProps) {
  const [showHints, setShowHints] = useState(false);
  const hintsId = useId();
  const speech = useSpeechInput(onDictate);
  const describedBy = [error && `${id}-error`, showHints && hintsId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <textarea
        id={id}
        rows={3}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(fieldClasses, "min-h-24 resize-y py-3 leading-relaxed [field-sizing:content]")}
        {...registration}
      />
      {(hints?.length || speech.supported) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {hints && hints.length > 0 && (
            <button type="button" aria-expanded={showHints} aria-controls={hintsId} onClick={() => setShowHints((v) => !v)} className={toolClasses}>
              <Lightbulb className="size-3.5" aria-hidden="true" /> {showHints ? "Hide prompts" : "Stuck? Try a prompt"}
            </button>
          )}
          {speech.supported && (
            <button
              type="button"
              aria-pressed={speech.listening}
              onClick={speech.listening ? speech.stop : speech.start}
              className={cn(toolClasses, speech.listening && "bg-primary-soft text-primary")}
            >
              {speech.listening ? <MicOff className="size-3.5" aria-hidden="true" /> : <Mic className="size-3.5" aria-hidden="true" />}
              {speech.listening ? "Stop dictating" : "Dictate"}
            </button>
          )}
        </div>
      )}
      {hints && (
        <ul id={hintsId} hidden={!showHints} className="mt-2 space-y-1.5 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
          {hints.map((hint) => (
            <li key={hint} className="flex gap-2">
              <span aria-hidden="true">·</span>
              {hint}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
