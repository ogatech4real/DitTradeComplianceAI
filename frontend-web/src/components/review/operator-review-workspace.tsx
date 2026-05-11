"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { FileText, Filter } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useLatestResultsQuery } from "@/hooks/use-latest-results-query";
import { isLatestResultsSuccess } from "@/lib/api/services/results";
import type { LatestResultsResponse } from "@/lib/contracts/results";
import type { PriorityReviewItem } from "@/lib/contracts/screening";
import { isEmptyEnvelope } from "@/lib/contracts/envelope";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { buildOperatorRiskDrivers } from "@/lib/intelligence/decision/operator-risk-drivers";

type EnrichedRow = PriorityReviewItem & {
  recordSignals?: Record<string, unknown>;
};

const columnHelper = createColumnHelper<EnrichedRow>();

function toNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function summarizeSignals(row: Record<string, unknown>): string[] {
  const lines: string[] = [];
  if (row.fraud_score != null) {
    lines.push(
      `Fraud composite score ${toNum(row.fraud_score).toFixed(3)} (${String(row.fraud_risk_label ?? "unclassified")})`,
    );
  }
  if (row.batch_risk_score != null) {
    lines.push(`Batch cohort pressure ${toNum(row.batch_risk_score).toFixed(3)}`);
  }
  if (row.rule_flag_count != null) {
    lines.push(`Rule engine flags raised: ${toNum(row.rule_flag_count)}`);
  }
  if (row.hybrid_risk_label) {
    lines.push(`Calibrated disposition label: ${String(row.hybrid_risk_label)}`);
  }
  return lines;
}

function severityRibbonClass(severity: unknown): string {
  const s = String(severity ?? "").toLowerCase();
  switch (s) {
    case "critical":
      return "border-l-[var(--semantic-critical)] bg-[var(--semantic-critical-soft)]/[0.22]";
    case "high":
      return "border-l-[var(--semantic-orange)] bg-[var(--semantic-orange-soft)]/[0.28]";
    case "medium":
      return "border-l-[var(--semantic-amber)] bg-[var(--semantic-amber)]/[0.12]";
    case "low":
      return "border-l-[var(--semantic-emerald)] bg-[var(--semantic-emerald-soft)]/[0.4]";
    default:
      return "border-l-muted-foreground/30 bg-muted/15";
  }
}

function SeverityBadge({ value }: { value: unknown }) {
  const raw = String(value ?? "—");
  const s = raw.toLowerCase();
  const cls =
    s === "critical"
      ? "border-[var(--semantic-critical)]/45 bg-[var(--semantic-critical-soft)] text-[var(--semantic-critical)]"
      : s === "high"
        ? "border-[var(--semantic-orange)]/45 bg-[var(--semantic-orange-soft)] text-[var(--semantic-orange)]"
        : s === "medium"
          ? "border-[var(--semantic-amber)]/45 bg-[var(--semantic-amber)]/[0.15] text-[var(--semantic-amber-fg)]"
          : s === "low"
            ? "border-[var(--semantic-emerald)]/45 bg-[var(--semantic-emerald-soft)] text-[var(--semantic-emerald)]"
            : "border-border text-muted-foreground";
  return (
    <Badge variant="outline" className={cn("text-[10px] font-semibold uppercase tracking-wide", cls)}>
      {raw}
    </Badge>
  );
}

function ConfidenceBadge({ label }: { label: unknown }) {
  const v = String(label ?? "").trim();
  if (!v) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center rounded-md border border-border/70 bg-muted/35 px-2 py-0.5 text-[10px] font-medium text-foreground">
      {v}
    </span>
  );
}

function useEnrichedQueue(data: LatestResultsResponse | undefined): EnrichedRow[] {
  return useMemo(() => {
    if (!data || isEmptyEnvelope(data) || !isLatestResultsSuccess(data)) {
      return [];
    }
    const records = data.records;
    const map = new Map<string, Record<string, unknown>>();
    for (const r of records) {
      const id = String(r.record_id ?? "");
      if (id) map.set(id, r);
    }
    return (data.priority_review_queue ?? []).map((item) => ({
      ...item,
      recordSignals: item.record_id ? map.get(String(item.record_id)) : undefined,
    }));
  }, [data]);
}

export function OperatorReviewWorkspace() {
  const latest = useLatestResultsQuery(true);
  const rows = useEnrichedQueue(latest.data);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "hybrid_score", desc: true },
  ]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [issueQuery, setIssueQuery] = useState("");
  const [briefingRow, setBriefingRow] = useState<EnrichedRow | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (severityFilter !== "all") {
        if (String(r.severity_level ?? "").toLowerCase() !== severityFilter) {
          return false;
        }
      }
      if (issueQuery.trim()) {
        const q = issueQuery.toLowerCase();
        const blob =
          `${r.compliance_issue ?? ""} ${r.recommended_action ?? ""} ${r.explanation ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [rows, severityFilter, issueQuery]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("review_priority", {
        header: "Queue rank",
        cell: (ctx) => (
          <span className="tabular-nums text-xs font-semibold text-muted-foreground">
            {ctx.getValue() ?? "—"}
          </span>
        ),
        size: 72,
      }),
      columnHelper.accessor("record_id", {
        header: "Declaration",
        cell: (ctx) => (
          <span className="font-medium tracking-tight text-foreground">{ctx.getValue() ?? "—"}</span>
        ),
      }),
      columnHelper.accessor("severity_level", {
        header: "Severity",
        cell: (ctx) => <SeverityBadge value={ctx.getValue()} />,
      }),
      columnHelper.accessor("hybrid_risk_label", {
        header: "Confidence band",
        cell: (ctx) => <ConfidenceBadge label={ctx.getValue()} />,
      }),
      columnHelper.accessor("hybrid_score", {
        header: () => (
          <span
            title="Composite screening score calibrated for routing — advisory, not jurisdictional adjudication."
            className="cursor-help border-b border-dotted border-muted-foreground/40"
          >
            Calibrated score
          </span>
        ),
        cell: (ctx) => {
          const v = ctx.getValue();
          return (
            <span className="tabular-nums text-sm font-semibold text-foreground">{v != null ? v.toFixed(3) : "—"}</span>
          );
        },
      }),
      columnHelper.accessor("compliance_issue", {
        header: "Control finding",
        cell: (ctx) => (
          <span className="max-w-[16rem] text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {ctx.getValue() ?? "—"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "explainability",
        header: "Evidence",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="xs"
            type="button"
            className="font-medium"
            onClick={() => setBriefingRow(row.original)}
          >
            <FileText className="mr-1.5 size-3.5" aria-hidden />
            Case sheet
          </Button>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const signalLines =
    briefingRow?.recordSignals != null ? summarizeSignals(briefingRow.recordSignals) : [];

  const riskDrivers =
    briefingRow?.recordSignals != null ? buildOperatorRiskDrivers(briefingRow.recordSignals) : [];

  if (latest.isPending) {
    return <Skeleton className="h-[520px] w-full rounded-2xl" />;
  }

  if (latest.isError) {
    return (
      <Card className="operational-surface border-destructive/30">
        <CardContent className="py-12 text-center text-sm text-destructive">
          No reviewable cohort is available yet. Confirm the API is reachable, then import a file from the workspace
          overview page.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Sheet open={!!briefingRow} onOpenChange={(o) => !o && setBriefingRow(null)}>
        <SheetContent className="w-[min(100vw,30rem)] border-l border-border/70 bg-background/98 p-0 sm:max-w-lg">
          <SheetHeader className="border-b border-border/60 px-6 py-5 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Case sheet
            </p>
            <SheetTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold">
              {briefingRow?.record_id ?? "Declaration"}
            </SheetTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {briefingRow?.severity_level ? <SeverityBadge value={briefingRow.severity_level} /> : null}
              {briefingRow?.hybrid_risk_label ? (
                <ConfidenceBadge label={briefingRow.hybrid_risk_label} />
              ) : null}
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100dvh-7.5rem)] px-6 py-5">
            <section className="space-y-6 text-sm">
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Analyst narrative
                </h4>
                <p className="mt-2 leading-relaxed text-foreground">
                  {(() => {
                    const fromRecord = briefingRow?.recordSignals?.explanation;
                    const raw =
                      fromRecord !== undefined && fromRecord !== null && String(fromRecord).trim() !== ""
                        ? String(fromRecord)
                        : (briefingRow?.explanation ?? "");
                    return raw.trim() !== "" ? raw : "No narrative was attached to this declaration.";
                  })()}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Why this exposure surfaced
                </h4>
                <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
                  {riskDrivers.length === 0 ? (
                    <li className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-foreground">
                      No supplemental driver lines — rely on the narrative and score context.
                    </li>
                  ) : (
                    riskDrivers.map((line) => (
                      <li
                        key={line}
                        className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-foreground"
                      >
                        {line}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Disposition guidance
                </h4>
                <p className="mt-2 font-medium text-foreground">{briefingRow?.review_status ?? "—"}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {briefingRow?.recommended_action ?? "No recommended action recorded."}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Model and rule signals
                </h4>
                <ul className="mt-3 space-y-2 text-[13px]">
                  {signalLines.length === 0 ? (
                    <li className="text-muted-foreground">No supplementary scores were attached for this row.</li>
                  ) : (
                    signalLines.map((line) => (
                      <li key={line} className="rounded-lg border border-dashed border-border/70 px-3 py-2 text-foreground">
                        {line}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </section>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <Card className="operational-surface overflow-hidden border-border/80 shadow-none">
          <CardHeader className="flex flex-col gap-5 border-b border-border/65 bg-muted/[0.2] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold">
                Review queue
              </CardTitle>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                Sort declarations, scan severity ribbons, then open evidence for each row. Suited for desk review ahead of
                disposition.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:flex-initial">
                <Filter className="pointer-events-none absolute top-2.5 left-2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search findings, actions, rationale…"
                  className="h-10 w-full min-w-[12rem] pl-9 text-[13px] sm:w-80"
                  value={issueQuery}
                  onChange={(e) => setIssueQuery(e.target.value)}
                />
              </div>
              <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v ?? "all")}>
                <SelectTrigger className="h-10 w-full sm:w-44">
                  <SelectValue placeholder="Severity tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tiers</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="border-b border-border/60 hover:bg-muted/35">
                      {hg.headers.map((header) => (
                        <TableHead key={header.id} className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                          {header.isPlaceholder ? null : (
                            <button
                              type="button"
                              className={
                                header.column.getCanSort()
                                  ? "flex cursor-pointer select-none items-center gap-1 text-left hover:text-primary"
                                  : ""
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: " ▲",
                                desc: " ▼",
                              }[header.column.getIsSorted() as string] ?? ""}
                            </button>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-20 text-center text-sm text-muted-foreground">
                        {rows.length === 0
                          ? "Nothing is queued yet — screening did not elevate declarations for supervisory review."
                          : "Nothing matches those filters."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => {
                      const sev = row.original.severity_level;
                      return (
                        <TableRow
                          key={row.id}
                          className={cn("border-border/55 border-l-4 transition-colors hover:bg-muted/35", severityRibbonClass(sev))}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="align-top py-4">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
