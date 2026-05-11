"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { NamedCount } from "@/lib/intelligence/decision/cohort-rankings";

interface CohortDimensionBarProps {
  title: string;
  description?: string;
  data: NamedCount[];
  valueLabel?: string;
  barFillVar?: string;
  emptyMessage?: string;
  chartHeightPx?: number;
}

export function CohortDimensionBar({
  title,
  description,
  data,
  valueLabel = "Records",
  barFillVar = "var(--chart-2)",
  emptyMessage = "No values in this cohort for this field.",
  chartHeightPx = 220,
}: CohortDimensionBarProps) {
  const rows = data.map((d) => ({
    ...d,
    label: d.name.length > 28 ? `${d.name.slice(0, 26)}…` : d.name,
  }));

  if (rows.length === 0) {
    return (
      <div className="operational-surface rounded-2xl border border-border/80 p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</h3>
        {description ? <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{description}</p> : null}
        <p className="mt-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="operational-surface rounded-2xl border border-border/80 p-5">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</h3>
      {description ? <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{description}</p> : null}
      <div className="mt-4 w-full min-w-0" style={{ height: chartHeightPx }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={rows}
            margin={{ left: 4, right: 16, top: 2, bottom: 2 }}
          >
            <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" horizontal={false} opacity={0.45} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
            <YAxis type="category" dataKey="label" width={120} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
            <Tooltip
              formatter={(v) =>
                [`${String(v ?? 0)} ${valueLabel.toLowerCase()}`, valueLabel] as [string, string]
              }
              labelFormatter={(_, payload) => {
                const row = payload?.[0]?.payload as { name?: string; label?: string } | undefined;
                return row?.name ?? row?.label ?? "";
              }}
              contentStyle={{
                borderRadius: 10,
                borderColor: "var(--border)",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" name={valueLabel} fill={barFillVar} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
