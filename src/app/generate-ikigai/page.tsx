import type { Metadata } from "next";
import { redirect } from "next/navigation";
import JourneyGate from "@/components/journey/JourneyGate";
import IdeasStep from "@/components/journey/IdeasStep";

export const metadata: Metadata = { title: "Your ideas" };

type Props = { searchParams: Promise<{ step?: string }> };

export default async function GenerateIkigaiPage({ searchParams }: Props) {
  // Legacy deep link to the image step.
  if ((await searchParams).step === "image") redirect("/generate-ikigai/card");

  return (
    <JourneyGate>
      <IdeasStep />
    </JourneyGate>
  );
}
