"use client";

import RouteError from "@/components/ui/RouteError";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} area="Profile" message="We couldn't load your profile. Please try again." />;
}
