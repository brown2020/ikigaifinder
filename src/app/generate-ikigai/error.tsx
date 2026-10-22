"use client";

import RouteError from "@/components/ui/RouteError";

export default function GenerateIkigaiError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} area="Generate Ikigai" message="We hit a problem while working on your ikigai. Please try again." />;
}
