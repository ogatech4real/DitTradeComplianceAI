"use client";

import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TECHNICAL_METRICS_GLOSSARY } from "@/lib/dashboard/technical-metrics-glossary";

const DEFAULT_GLOSSARY_ID = TECHNICAL_METRICS_GLOSSARY[0]?.id ?? "";

export function TechnicalMetricsGlossarySelect() {
  const [value, setValue] = useState<string>(DEFAULT_GLOSSARY_ID);
  const entry = useMemo(
    () => TECHNICAL_METRICS_GLOSSARY.find((e) => e.id === value),
    [value],
  );

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Technical glossary
      </p>
      <Select value={value} onValueChange={(v) => setValue(v ?? DEFAULT_GLOSSARY_ID)}>
        <SelectTrigger size="sm" className="h-9 w-full min-w-[12rem] max-w-md bg-background/70">
          <SelectValue placeholder="Pick a metric or term" />
        </SelectTrigger>
        <SelectContent className="max-h-[min(60vh,24rem)]">
          {TECHNICAL_METRICS_GLOSSARY.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {entry ? (
        <div className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5 text-[13px] leading-relaxed text-foreground">
          <span className="font-semibold text-foreground">{entry.label}</span>
          <p className="mt-2 text-muted-foreground">{entry.body}</p>
        </div>
      ) : null}
    </div>
  );
}
