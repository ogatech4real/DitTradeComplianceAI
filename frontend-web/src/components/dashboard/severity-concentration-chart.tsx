"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

const ORDER = ["critical", "high", "medium", "low", "unknown"] as const;

const FILL: Record<(typeof ORDER)[number], string> = {
  critical: "var(--semantic-critical)",
  high: "var(--semantic-orange)",
  medium: "var(--semantic-amber)",
  low: "var(--semantic-emerald)",
  unknown: "var(--muted-foreground)",
};

export function SeverityConcentrationChart({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const bd = payload.severity_breakdown;
  const chartData = ORDER.map((severity) => ({
    severity: severity.charAt(0).toUpperCase() + severity.slice(1),
    severityKey: severity,
    count: bd[severity] ?? 0,
  }));

  return (
    <div className="h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} opacity={0.55} />
          <XAxis dataKey="severity" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.12 }}
            contentStyle={{
              borderRadius: 10,
              borderColor: "var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" name="Declarations" radius={[5, 5, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.severityKey} fill={FILL[entry.severityKey]} opacity={0.92} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
