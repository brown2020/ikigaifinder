"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Short name for the log line, e.g. "Dashboard". */
  area: string;
  message: string;
}

/** Shared body for route-segment error.tsx boundaries. */
export default function RouteError({ error, reset, area, message }: RouteErrorProps) {
  useEffect(() => {
    console.error(`${area} error:`, error);
  }, [area, error]);

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <Card padded className="w-full max-w-md text-center" role="alert">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-destructive-soft text-destructive">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
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
