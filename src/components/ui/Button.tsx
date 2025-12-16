"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = "primary" | "secondary" | "neutral" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Icon to show on the left */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-400",
  neutral: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

// ============================================================================
// Component
// ============================================================================

/**
 * Reusable Button Component
 *
 * Features:
 * - Multiple variants (primary, secondary, neutral, danger, ghost)
 * - Multiple sizes (sm, md, lg)
 * - Loading state with spinner
 * - Left and right icon support
 * - Full width option
 * - Proper focus and disabled states
 * - Forwards ref for form integration
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 font-medium rounded-md",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          // Custom className
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ============================================================================
// Sub-Components
// ============================================================================

function LoadingSpinner(): React.ReactElement {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ============================================================================
// Icon Button Variant
// ============================================================================

interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

/**
 * Icon-only button variant
 * Requires aria-label for accessibility
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "md", ...props }, ref) => {
    const iconSizeStyles: Record<ButtonSize, string> = {
      sm: "p-1.5",
      md: "p-2",
      lg: "p-3",
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn(iconSizeStyles[size], "!px-0", className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

export default Button;






