"use client";

import RouteError from "@/components/ui/RouteError";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} area="Dashboard" message="We couldn't load your dashboard. Please try again." />;
}
