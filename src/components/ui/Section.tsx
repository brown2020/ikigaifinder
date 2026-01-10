"use client";

import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";
import { Container } from "./Container";

type SectionProps = PropsWithChildren<{
  className?: string;
  containerClassName?: string;
  size?: "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
}>;

const paddings: Record<NonNullable<SectionProps["padding"]>, string> = {
  none: "",
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
};

export function Section({
  children,
  className,
  containerClassName,
  size = "lg",
  padding = "md",
}: SectionProps): React.ReactElement {
  return (
    <section className={cn(paddings[padding], className)}>
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}

