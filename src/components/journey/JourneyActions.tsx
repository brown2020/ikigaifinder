import { cn } from "@/utils/cn";

/**
 * The step's main actions. On phones the bar stays pinned above the bottom nav
 * (which only signed-in visitors see) so the next step is always one tap away.
 */
export default function JourneyActions({
  aboveNav,
  className,
  children,
}: {
  aboveNav: boolean;
  className?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      data-bottom-bar="phone"
      className={cn(
        "sticky z-20 -mx-5 mt-6 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-5 py-3 backdrop-blur",
        "sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none",
        aboveNav ? "bottom-14" : "bottom-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className
      )}
    >
      {children}
    </div>
  );
}
