import type { Metadata } from "next";
import JourneyGate from "@/components/journey/JourneyGate";
import CardStep from "@/components/journey/CardStep";

export const metadata: Metadata = { title: "Design your card" };

export default function CardPage() {
  return (
    <JourneyGate>
      <CardStep />
    </JourneyGate>
  );
}
