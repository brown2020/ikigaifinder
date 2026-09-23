import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  fullScreen = false,
  className,
  label = "Loading…",
}: LoadingSpinnerProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 text-muted-foreground",
        fullScreen && "min-h-[60vh] w-full",
        className
      )}
      role="status"
    >
      <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
