import React from "react";

// ============================================================================
// Types
// ============================================================================

interface IkigaiLogoProps {
  /** CSS class name for sizing and styling */
  className?: string;
  /** Fill color for the circles */
  fill?: string;
  /** Stroke color for the circles */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Ikigai Venn Diagram Logo
 *
 * Renders the iconic 4-circle Venn diagram representing Ikigai:
 * - Top: What you love (Passion)
 * - Right: What you're good at (Profession)
 * - Bottom: What the world needs (Mission)
 * - Left: What you can be paid for (Vocation)
 */
export default function IkigaiLogo({
  className = "h-10 w-10",
  fill = "none",
  strokeColor = "black",
  strokeWidth = 25,
}: IkigaiLogoProps): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      className={className}
      aria-label="Ikigai logo"
      role="img"
    >
      {/* Top circle - Passion */}
      <circle
        cx="250"
        cy="150"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Right circle - Profession */}
      <circle
        cx="350"
        cy="250"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Bottom circle - Mission */}
      <circle
        cx="250"
        cy="350"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Left circle - Vocation */}
      <circle
        cx="150"
        cy="250"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

// Named export for convenience
export { IkigaiLogo };









