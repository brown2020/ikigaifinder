import { cn } from "@/utils/cn";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({
  className,
  padded = false,
  ...props
}: DivProps & { padded?: boolean }): React.ReactElement {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(31,26,23,0.04),0_8px_24px_-12px_rgba(31,26,23,0.12)]",
        padded && "p-6 sm:p-8",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("flex flex-col gap-1.5 p-6 sm:p-8", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-xl font-semibold", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-6 pt-0 sm:p-8 sm:pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("flex items-center gap-3 p-6 pt-0 sm:p-8 sm:pt-0", className)}
      {...props}
    />
  );
}

export default Card;
