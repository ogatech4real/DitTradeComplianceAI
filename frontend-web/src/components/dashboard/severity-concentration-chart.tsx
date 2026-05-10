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

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

const ORDER = ["critical", "high", "medium", "low", "unknown"];

export function SeverityConcentrationChart({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const bd = payload.severity_breakdown;
  const chartData = ORDER.map((severity) => ({
    severity: severity.charAt(0).toUpperCase() + severity.slice(1),
    count: bd[severity] ?? 0,
  }));

  return (
    <div className="h-[260px] w-full min-w-0">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Severity concentration
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="severity" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.15 }}
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" name="Records" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
