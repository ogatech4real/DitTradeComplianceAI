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
import { deriveJurisdictionStrata } from "@/lib/intelligence/decision/jurisdiction-strata";

export function JurisdictionExposureChart({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const strata = deriveJurisdictionStrata(payload).map((s) => ({
    market: s.code,
    exposure: Math.round(s.exposureIndex * 1000) / 1000,
  }));

  if (strata.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">No jurisdiction strata surfaced for this cohort.</p>
    );
  }

  return (
    <div className="h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={strata}
          margin={{ left: 8, right: 16, top: 4, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" horizontal={false} opacity={0.55} />
          <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="market"
            width={56}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              borderColor: "var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="exposure" name="Relative exposure index" fill="var(--chart-3)" radius={[0, 5, 5, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
