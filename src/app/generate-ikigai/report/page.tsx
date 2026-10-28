import type { Metadata } from "next";
import JourneyGate from "@/components/journey/JourneyGate";
import ReportStep from "@/components/journey/ReportStep";
import { requirePageSession } from "@/lib/auth/requirePage";

export const metadata: Metadata = { title: "Your insights" };

export default async function ReportPage() {
  await requirePageSession("/generate-ikigai/report");
  return (
    <JourneyGate>
      <ReportStep />
    </JourneyGate>
  );
}
