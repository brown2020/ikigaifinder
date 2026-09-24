import type { Metadata } from "next";
import JourneyGate from "@/components/journey/JourneyGate";
import QuickQuestionnaire from "@/components/journey/QuickQuestionnaire";

export const metadata: Metadata = { title: "Quick start" };

export default function QuickStartPage() {
  return (
    <JourneyGate>
      <QuickQuestionnaire />
    </JourneyGate>
  );
}
