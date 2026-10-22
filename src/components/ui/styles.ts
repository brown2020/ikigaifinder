import { cn } from "@/utils/cn";

/** Class-name recipes shared by components. Kept out of component files so Fast Refresh keeps state. */

export type ButtonVariant = "primary" | "secondary" | "neutral" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}


const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
  secondary: "bg-primary-soft text-primary-hover hover:bg-[#f3d8c9]",
  neutral:
    "border border-border-strong bg-card text-foreground hover:bg-muted",
  danger: "bg-destructive text-destructive-foreground hover:bg-[#912018]",
  ghost: "text-foreground hover:bg-muted",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonStyleProps = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full"
  );
}

export const fieldClasses = cn(
  "w-full rounded-xl border border-input bg-card px-4 text-[15px] text-foreground",
  "placeholder:text-muted-foreground/70 transition-colors duration-150",
  "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15",
  "disabled:cursor-not-allowed disabled:bg-muted",
  "aria-invalid:border-destructive aria-invalid:focus:ring-destructive/15"
);

export const textLinkClasses =
  "font-medium text-primary underline-offset-4 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";
