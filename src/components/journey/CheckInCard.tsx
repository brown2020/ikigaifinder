"use client";

import { useState } from "react";
import { CalendarPlus, History, RefreshCcw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { absoluteUrl } from "@/utils/baseUrl";
import { downloadCalendarReminder } from "@/utils/calendar";
import { displayStatement } from "@/utils/ikigaiList";
import type { Ikigai } from "@/types";

const CHECK_IN_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (iso: string | null | undefined) => {
  const date = iso ? new Date(iso) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;
};

/** Invites a periodic re-reflection and shows how the person's ikigai has changed. */
export default function CheckInCard({ ikigai, className }: { ikigai: Ikigai; className?: string }) {
  const [now] = useState(() => Date.now());
  const chosen = ikigai.ikigaiSelectedAt ? new Date(ikigai.ikigaiSelectedAt).getTime() : null;
  const days = chosen ? Math.floor((now - chosen) / DAY_MS) : null;
  const due = days !== null && days >= CHECK_IN_DAYS;
  const history = [...(ikigai.ikigaiHistory ?? [])].reverse();

  const remind = () => {
    const base = chosen && !due ? chosen : now;
    downloadCalendarReminder({
      date: new Date(base + CHECK_IN_DAYS * DAY_MS),
      title: "Ikigai check-in",
      description: "Revisit your answers and see how your ikigai has changed.",
      url: absoluteUrl("/dashboard"),
    });
  };

  return (
    <Card className={className ?? "p-6"}>
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
        <RefreshCcw className="size-5 text-primary" aria-hidden="true" /> Check in
      </h2>
      <p className="mt-2 text-muted-foreground">
        {due
          ? `You chose this statement ${Math.floor((days ?? 0) / 30)} months ago. People change; see whether your ikigai has too.`
          : chosen
            ? `Chosen on ${formatDate(ikigai.ikigaiSelectedAt)}. Ikigai shifts as you do, so revisit your answers every few months.`
            : "Ikigai shifts as you do. Revisit your answers every few months to see what has changed."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <ButtonLink href="/ikigai-finder?step=1" size="sm" variant={due ? "primary" : "neutral"}>
          Start a check-in
        </ButtonLink>
        <Button size="sm" variant="ghost" onClick={remind} leftIcon={<CalendarPlus className="size-4" aria-hidden="true" />}>
          Remind me in 3 months
        </Button>
      </div>

      {history.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <History className="size-4 text-muted-foreground" aria-hidden="true" /> How your ikigai has changed
          </h3>
          <ol className="mt-3 space-y-3">
            {history.map((entry) => (
              <li key={`${entry.replacedAt}-${entry.ikigai}`} className="border-l-2 border-border-strong pl-3">
                <p className="text-xs text-muted-foreground">
                  {formatDate(entry.chosenAt) ?? "Earlier"} – {formatDate(entry.replacedAt)}
                </p>
                <p className="mt-0.5 text-sm">{displayStatement(entry.ikigai)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}
