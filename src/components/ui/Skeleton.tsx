"use client";

import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

interface SkeletonProps {
  className?: string;
}

interface IkigaiOptionSkeletonProps {
  count?: number;
}

// ============================================================================
// Base Skeleton Component
// ============================================================================

/**
 * Base skeleton component for loading states
 * Provides a pulsing animation effect
 */
export function Skeleton({ className }: SkeletonProps): React.ReactElement {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  );
}

// ============================================================================
// Specialized Skeleton Components
// ============================================================================

/**
 * Skeleton for text content
 */
export function TextSkeleton({ className }: SkeletonProps): React.ReactElement {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

/**
 * Skeleton for a card container
 */
export function CardSkeleton({ className }: SkeletonProps): React.ReactElement {
  return (
    <div className={cn("border rounded-lg p-4 space-y-3", className)}>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

/**
 * Skeleton for circular avatar
 */
export function AvatarSkeleton({ className }: SkeletonProps): React.ReactElement {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
}

/**
 * Skeleton for ikigai option card
 */
export function IkigaiOptionSkeleton(): React.ReactElement {
  return (
    <div className="md:p-4 p-2 border rounded-md shadow-md mt-4 animate-pulse">
      {/* Ikigai statement */}
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-4/5 mb-4" />

      {/* Score indicators */}
      <div className="flex flex-wrap xs:gap-2 gap-1 mt-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="md:mx-3 sm:min-w-[90px] xs:min-w-[65px] min-w-[70px] flex flex-col items-center"
          >
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="h-3 w-16 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Multiple ikigai option skeletons
 */
export function IkigaiOptionsLoadingSkeleton({
  count = 3,
}: IkigaiOptionSkeletonProps): React.ReactElement {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <IkigaiOptionSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the form stepper
 */
export function StepperSkeleton(): React.ReactElement {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-full" />
        ))}
      </div>
      <div className="text-center mt-2">
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    </div>
  );
}

/**
 * Skeleton for image loading
 */
export function ImageSkeleton({ className }: SkeletonProps): React.ReactElement {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Full page loading skeleton
 */
export function PageLoadingSkeleton(): React.ReactElement {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Dashboard skeleton
 */
export function DashboardSkeleton(): React.ReactElement {
  return (
    <div className="p-10">
      <div className="w-full max-w-3xl mx-auto">
        {/* Image skeleton */}
        <ImageSkeleton className="w-full aspect-square max-w-3xl" />

        {/* Share buttons skeleton */}
        <div className="flex flex-wrap gap-3 mx-auto h-12 justify-center mt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-12 h-12 rounded-full" />
          ))}
        </div>

        {/* Download button skeleton */}
        <Skeleton className="h-12 w-32 mx-auto mt-4 rounded-sm" />
      </div>
    </div>
  );
}

export default Skeleton;







