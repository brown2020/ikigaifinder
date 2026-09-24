import { IKIGAI_INTERSECTIONS } from "@/constants/ikigai";
import { displayStatement } from "@/utils/ikigaiList";
import { cn } from "@/utils/cn";
import type { IkigaiData, IkigaiScores } from "@/types";

const COLUMNS: { key: keyof IkigaiScores; label: string }[] = [
  ...IKIGAI_INTERSECTIONS.map((x) => ({ key: x.key, label: x.label })),
  { key: "OverallCompatibility", label: "Fit" },
];

/** Side-by-side scores for shortlisted statements, with each column's leader marked. */
export default function ShortlistCompare({ items }: { items: IkigaiData[] }): React.ReactElement {
  const best = Object.fromEntries(
    COLUMNS.map((c) => [c.key, Math.max(...items.map((i) => Number(i[c.key]) || 0))])
  );
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">Scores for your shortlisted statements. The highest score in each column is marked.</caption>
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th scope="col" className="p-3 font-medium">Statement</th>
            {COLUMNS.map((c) => (
              <th key={c.key} scope="col" className="p-3 text-right font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.ikigai} className="border-b border-border last:border-0">
              <th scope="row" className="max-w-[280px] p-3 text-left font-normal">
                <span className="line-clamp-2">{displayStatement(item.ikigai).replace(/^My ikigai is to /i, "…")}</span>
              </th>
              {COLUMNS.map((c) => {
                const v = Math.round(Number(item[c.key]) || 0);
                const top = items.length > 1 && v === best[c.key];
                return (
                  <td key={c.key} className={cn("p-3 text-right tabular-nums", top && "font-semibold text-primary")}>
                    {v}
                    {top && <span className="sr-only"> (highest)</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
