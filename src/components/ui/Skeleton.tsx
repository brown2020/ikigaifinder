import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }): React.ReactElement {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-muted", className)} />;
}

export function PageLoadingSkeleton(): React.ReactElement {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-12" role="status" aria-label="Loading">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

export function DashboardSkeleton(): React.ReactElement {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_1fr]" role="status" aria-label="Loading">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default Skeleton;
