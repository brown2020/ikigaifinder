import type { Metadata } from "next";
import JourneyGate from "@/components/journey/JourneyGate";
import CardStep from "@/components/journey/CardStep";
import { requirePageSession } from "@/lib/auth/requirePage";

export const metadata: Metadata = { title: "Design your card" };

export default async function CardPage() {
  await requirePageSession("/generate-ikigai/card");
  return (
    <JourneyGate>
      <CardStep />
    </JourneyGate>
  );
}
