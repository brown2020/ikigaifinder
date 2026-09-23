import { IKIGAI_CIRCLES, IKIGAI_INTERSECTIONS } from "@/constants/ikigai";
import type { IkigaiScores } from "@/types";
import { cn } from "@/utils/cn";

const colorOf = Object.fromEntries(IKIGAI_CIRCLES.map((c) => [c.id, c.color]));

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

export function OverallBadge({ value, className }: { value: number; className?: string }) {
  const v = clamp(value);
  return (
    <div className={cn("flex shrink-0 flex-col items-center", className)}>
      <div
        className="grid size-14 place-items-center rounded-full"
        style={{ background: `conic-gradient(#b8401a ${v * 3.6}deg, #efe7dc 0deg)` }}
        aria-hidden="true"
      >
        <div className="grid size-11 place-items-center rounded-full bg-card font-display text-base font-semibold tabular-nums">
          {v}
        </div>
      </div>
      <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">fit</span>
      <span className="sr-only">Overall fit {v} out of 100</span>
    </div>
  );
}

export default function ScoreBars({ scores, className }: { scores: IkigaiScores; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-4", className)}>
      {IKIGAI_INTERSECTIONS.map((x) => {
        const v = clamp(scores[x.key]);
        const [a, b] = x.between;
        return (
          <div key={x.key}>
            <dt className="flex items-baseline justify-between text-xs text-muted-foreground">
              <span>{x.label}</span>
              <span className="tabular-nums">{v}</span>
            </dt>
            <dd className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${v}%`, background: `linear-gradient(90deg, ${colorOf[a]}, ${colorOf[b]})` }}
              />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
