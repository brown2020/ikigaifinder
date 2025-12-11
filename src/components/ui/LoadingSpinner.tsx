"use client";

import { ClipLoader } from "react-spinners";
import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Spinner color */
  color?: string;
  /** Display full screen with centered spinner */
  fullScreen?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_MAP: Record<SpinnerSize, number> = {
  sm: 30,
  md: 50,
  lg: 80,
};

// ============================================================================
// Component
// ============================================================================

/**
 * Reusable Loading Spinner Component
 *
 * Features:
 * - Three size presets (sm, md, lg)
 * - Customizable color
 * - Full-screen mode with backdrop
 * - Accessibility support with sr-only label
 */
export function LoadingSpinner({
  size = "md",
  color = "#333b51",
  fullScreen = false,
  className,
  label = "Loading...",
}: LoadingSpinnerProps): React.ReactElement {
  const spinner = (
    <div
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label={label}
    >
      <ClipLoader color={color} size={SIZE_MAP[size]} />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Full-screen loading overlay with dark background
 * Used during initial app loading
 */
export function AppLoadingScreen(): React.ReactElement {
  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{ backgroundColor: "#333b51" }}
      role="status"
      aria-label="Loading application"
    >
      <ClipLoader color="#fff" size={80} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
