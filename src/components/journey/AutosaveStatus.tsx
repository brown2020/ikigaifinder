import { Check } from "lucide-react";
import type { AutosaveState } from "@/hooks/use-answer-autosave";
import { cn } from "@/utils/cn";

const TEXT: Record<AutosaveState, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Couldn't save. We'll retry when you continue.",
};

export default function AutosaveStatus({ state, className }: { state: AutosaveState; className?: string }) {
  return (
    <p role="status" className={cn("text-sm text-muted-foreground", state === "error" && "text-destructive", className)}>
      {state === "saved" && <Check className="mr-1 inline size-3.5" aria-hidden="true" />}
      {TEXT[state]}
    </p>
  );
}
