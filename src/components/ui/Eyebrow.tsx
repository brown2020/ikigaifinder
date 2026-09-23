import { cn } from "@/utils/cn";

export function Eyebrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
        className
      )}
      {...props}
    />
  );
}
