"use client";

import RouteError from "@/components/ui/RouteError";

export default function ShareError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} area="Share page" message="We couldn't load this ikigai. Please try again." />;
}
