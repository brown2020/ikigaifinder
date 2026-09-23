"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface TagInputProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  max?: number;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}

export default function TagInput({
  id,
  value,
  onChange,
  suggestions,
  max = Infinity,
  placeholder,
  invalid,
  describedBy,
}: TagInputProps): React.ReactElement {
  const [draft, setDraft] = useState("");
  const selected = new Set(value.map((v) => v.toLowerCase()));
  const atLimit = value.length >= max;
  const chips = [...suggestions, ...value.filter((v) => !suggestions.some((s) => s.toLowerCase() === v.toLowerCase()))];

  const toggle = (tag: string) => {
    if (selected.has(tag.toLowerCase())) {
      onChange(value.filter((v) => v.toLowerCase() !== tag.toLowerCase()));
    } else if (!atLimit) {
      onChange([...value, tag]);
    }
  };

  const commitDraft = () => {
    const tag = draft.trim().replace(/,$/, "");
    if (tag && !selected.has(tag.toLowerCase()) && !atLimit) onChange([...value, tag]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy} className="flex flex-wrap gap-2">
        {chips.map((tag) => {
          const on = selected.has(tag.toLowerCase());
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              disabled={!on && atLimit}
              onClick={() => toggle(tag)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-40",
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border-strong bg-card text-foreground hover:border-primary/60"
              )}
            >
              {tag}
              {on && <X className="size-3.5" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          disabled={atLimit}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commitDraft();
            }
          }}
          placeholder={atLimit ? `You've picked ${max}` : placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-10 w-full max-w-xs rounded-full border border-input bg-card px-4 text-sm",
            "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:bg-muted"
          )}
        />
        <button
          type="button"
          onClick={commitDraft}
          disabled={!draft.trim() || atLimit}
          aria-label="Add interest"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-card hover:bg-muted disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
