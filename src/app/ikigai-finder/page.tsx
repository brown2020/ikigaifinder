import type { Metadata } from "next";
import { Suspense } from "react";
import JourneyGate from "@/components/journey/JourneyGate";
import Questionnaire from "@/components/journey/Questionnaire";
import { PageLoadingSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Questions" };

export default function IkigaiFinderPage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <JourneyGate>
        <Questionnaire />
      </JourneyGate>
    </Suspense>
  );
}
