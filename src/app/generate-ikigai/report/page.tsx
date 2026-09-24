import type { Metadata } from "next";
import JourneyGate from "@/components/journey/JourneyGate";
import ReportStep from "@/components/journey/ReportStep";

export const metadata: Metadata = { title: "Your insights" };

export default function ReportPage() {
  return (
    <JourneyGate>
      <ReportStep />
    </JourneyGate>
  );
}
