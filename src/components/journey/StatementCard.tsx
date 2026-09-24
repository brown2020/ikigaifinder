"use client";

import { useState } from "react";
import { Check, Pencil, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/Input";
import ScoreBars, { OverallBadge } from "@/components/ikigai/ScoreBars";
import { displayStatement } from "@/utils/ikigaiList";
import { cn } from "@/utils/cn";
import type { IkigaiData } from "@/types";

interface StatementCardProps {
  item: IkigaiData;
  selected: boolean;
  onSelect: () => void;
  onEdit: (text: string) => void;
  /** Asks for new statements close to this one. */
  onMoreLikeThis?: () => void;
  busy?: boolean;
}

const footerButton =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export default function StatementCard({ item, selected, onSelect, onEdit, onMoreLikeThis, busy }: StatementCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  return (
    <li
      className={cn(
        "rounded-2xl border bg-card transition-all duration-200 animate-rise",
        selected
          ? "border-primary shadow-[0_0_0_3px_rgba(184,64,26,0.15)]"
          : "border-border hover:border-border-strong"
      )}
    >
      {editing ? (
        <div className="p-5 sm:p-6">
          <label htmlFor="edit-statement" className="text-sm font-medium">
            Edit your statement
          </label>
          <textarea
            id="edit-statement"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={400}
            autoFocus
            className={cn(fieldClasses, "mt-2 min-h-24 py-3 font-display text-lg leading-snug [field-sizing:content]")}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={draft.trim().length < 10}
              onClick={() => {
                onEdit(draft.trim());
                setEditing(false);
              }}
            >
              Save wording
            </Button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className="flex w-full gap-4 rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-6 sm:p-6"
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors",
                selected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong"
              )}
            >
              {selected && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg leading-snug sm:text-xl">
                {displayStatement(item.ikigai)}
              </span>
              <ScoreBars scores={item} className="mt-5" />
            </span>
            <OverallBadge value={item.OverallCompatibility} className="hidden sm:flex" />
          </button>
          {selected && (
            <div className="flex flex-wrap justify-end gap-1 border-t border-border px-4 py-2">
              {onMoreLikeThis && (
                <button type="button" onClick={onMoreLikeThis} disabled={busy} className={footerButton}>
                  <Shuffle className="size-3.5" aria-hidden="true" /> More like this
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDraft(displayStatement(item.ikigai));
                  setEditing(true);
                }}
                className={footerButton}
              >
                <Pencil className="size-3.5" aria-hidden="true" /> Edit wording
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
}
