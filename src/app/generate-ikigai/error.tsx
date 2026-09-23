"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function GenerateIkigaiError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Generate Ikigai error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <Card padded className="w-full max-w-md text-center" role="alert">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-destructive-soft text-destructive">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted-foreground">
          We hit a problem while working on your ikigai. Please try again.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-muted-foreground">
            Reference: <code className="font-mono">{error.digest}</code>
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} leftIcon={<RefreshCw className="size-4" aria-hidden="true" />}>
            Try again
          </Button>
          <ButtonLink href="/" variant="neutral">
            Go home
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
