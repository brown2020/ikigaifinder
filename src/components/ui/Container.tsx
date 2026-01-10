"use client";

import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type ContainerProps = PropsWithChildren<{
  className?: string;
  size?: "sm" | "md" | "lg";
}>;

const sizes: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
};

export function Container({
  children,
  className,
  size = "lg",
}: ContainerProps): React.ReactElement {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-10", sizes[size], className)}>
      {children}
    </div>
  );
}

