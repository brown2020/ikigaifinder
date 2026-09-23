import { IKIGAI_CIRCLES, type CircleId } from "@/constants/ikigai";
import { cn } from "@/utils/cn";

const POSITIONS: Record<CircleId, { cx: number; cy: number; lx: number; ly: number; lines: [string, string] }> = {
  love: { cx: 200, cy: 128, lx: 200, ly: 72, lines: ["What you", "love"] },
  skill: { cx: 128, cy: 200, lx: 70, ly: 196, lines: ["What you're", "good at"] },
  world: { cx: 272, cy: 200, lx: 330, ly: 196, lines: ["What the", "world needs"] },
  paid: { cx: 200, cy: 272, lx: 200, ly: 326, lines: ["What you can", "be paid for"] },
};

interface IkigaiDiagramProps {
  className?: string;
  /** Circles to render in full color; the rest render as outlines. Defaults to all. */
  active?: Partial<Record<CircleId, boolean>>;
  /** Circle to emphasize (e.g. the current questionnaire section). */
  highlight?: CircleId;
  showLabels?: boolean;
  centerLabel?: string;
  /** Lights the center when the user has found their ikigai. */
  centerActive?: boolean;
  title?: string;
}

export default function IkigaiDiagram({
  className,
  active,
  highlight,
  showLabels = false,
  centerLabel = "ikigai",
  centerActive = true,
  title = "Ikigai diagram: what you love, what you're good at, what the world needs, and what you can be paid for",
}: IkigaiDiagramProps): React.ReactElement {
  return (
    <svg viewBox="0 0 400 400" className={cn("h-auto w-full", className)} role="img" aria-label={title}>
      <g style={{ mixBlendMode: "multiply" }}>
        {IKIGAI_CIRCLES.map((circle) => {
          const { cx, cy } = POSITIONS[circle.id];
          const isActive = active ? Boolean(active[circle.id]) : true;
          const isHighlight = highlight === circle.id;
          return (
            <circle
              key={circle.id}
              cx={cx}
              cy={cy}
              r={isHighlight ? 104 : 100}
              fill={circle.color}
              fillOpacity={isActive ? (isHighlight ? 0.42 : 0.3) : 0.04}
              stroke={circle.color}
              strokeOpacity={isActive || isHighlight ? 0.9 : 0.35}
              strokeWidth={isHighlight ? 3 : 1.5}
              strokeDasharray={isActive || isHighlight ? undefined : "4 5"}
              className="transition-all duration-500"
            />
          );
        })}
      </g>
      <circle
        cx="200"
        cy="200"
        r="26"
        fill={centerActive ? "#b8401a" : "#ffffff"}
        stroke="#b8401a"
        strokeWidth="1.5"
        className="transition-colors duration-500"
      />
      <text
        x="200"
        y="204"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.06em"
        fill={centerActive ? "#ffffff" : "#b8401a"}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {centerLabel}
      </text>
      {showLabels &&
        IKIGAI_CIRCLES.map((circle) => {
          const { lx, ly, lines } = POSITIONS[circle.id];
          return (
            <text
              key={circle.id}
              x={lx}
              y={ly}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#1f1a17"
            >
              <tspan x={lx}>{lines[0]}</tspan>
              <tspan x={lx} dy="1.25em">{lines[1]}</tspan>
            </text>
          );
        })}
    </svg>
  );
}
