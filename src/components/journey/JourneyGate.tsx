"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageLoadingSkeleton } from "@/components/ui/Skeleton";
import { useIkigaiStore } from "@/zustand";

/** Renders children only once the user's saved ikigai has loaded. */
export default function JourneyGate({ children }: { children: React.ReactNode }): React.ReactElement {
  const status = useIkigaiStore((s) => s.status);
  const fetchIkigai = useIkigaiStore((s) => s.fetchIkigai);

  if (status === "error") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">We couldn&apos;t load your progress</h1>
        <p className="mt-2 text-muted-foreground">Check your connection and try again.</p>
        <Button className="mt-6" onClick={fetchIkigai} leftIcon={<RotateCw className="size-4" aria-hidden="true" />}>
          Retry
        </Button>
      </div>
    );
  }
  if (status !== "ready") return <PageLoadingSkeleton />;
  return <>{children}</>;
}
