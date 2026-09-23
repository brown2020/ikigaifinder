import type { ReactNode } from "react";
import Link from "next/link";
import IkigaiLogo from "@/components/icons/IkigaiLogo";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface AuthCardProps {
  title: ReactNode;
  description?: ReactNode;
  titleId?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  titleId,
  children,
  footer,
  className,
}: AuthCardProps): React.ReactElement {
  return (
    <Card className={cn("w-full max-w-md animate-rise p-6 sm:p-10", className)}>
      <div className="mb-8 flex flex-col items-center text-center">
        <Link
          href="/"
          aria-label="Ikigai Finder home"
          className="mb-5 rounded-full text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <IkigaiLogo className="size-11" />
        </Link>
        <h1
          id={titleId}
          className="font-display text-3xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
      {footer && (
        <div className="mt-8 border-t border-border pt-6">{footer}</div>
      )}
    </Card>
  );
}

export function AuthPageShell({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <section className="flex flex-1 items-center justify-center px-5 py-12 sm:py-20">
      {children}
    </section>
  );
}

export function AuthCardFallback(): React.ReactElement {
  return (
    <Card className="flex h-96 w-full max-w-md items-center justify-center">
      <span className="text-sm text-muted-foreground" role="status">
        Loading…
      </span>
    </Card>
  );
}

export function AuthErrorAlert({ message }: { message: string }): React.ReactElement {
  return (
    <div
      className="rounded-xl border border-destructive/20 bg-destructive-soft px-4 py-3 text-sm text-destructive"
      role="alert"
    >
      {message}
    </div>
  );
}

export const authLinkClasses =
  "font-medium text-primary underline-offset-4 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";
