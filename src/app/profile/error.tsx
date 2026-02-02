"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Profile error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        We encountered an error loading your profile. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
