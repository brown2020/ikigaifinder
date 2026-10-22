import { forwardRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { buttonClasses, type ButtonStyleProps } from "./styles";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
);

Button.displayName = "Button";

interface ButtonLinkProps
  extends React.ComponentProps<typeof Link>,
    ButtonStyleProps {}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps): React.ReactElement {
  return (
    <Link
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

interface IconButtonProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "md", ...props }, ref) => (
    <Button
      ref={ref}
      size={size}
      className={cn(
        "px-0",
        size === "sm" ? "w-9" : size === "lg" ? "w-12" : "w-11",
        className
      )}
      {...props}
    >
      {icon}
    </Button>
  )
);

IconButton.displayName = "IconButton";

export default Button;
