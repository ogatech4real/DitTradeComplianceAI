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
      <p className="text-sm text-muted-foreground">No jurisdiction signals in cohort.</p>
    );
  }

  return (
    <div className="h-[280px] w-full min-w-0">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Jurisdiction exposure index
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={strata}
          margin={{ left: 8, right: 16, top: 4, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="market"
            width={56}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="exposure" name="Exposure index" fill="var(--chart-3)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Derived from hybrid score × cohort mass × review pressure — not raw row tables.
      </p>
    </div>
  );
}
