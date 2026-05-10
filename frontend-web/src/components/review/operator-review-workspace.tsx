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
      `Fraud composite ${toNum(row.fraud_score).toFixed(3)} (${String(row.fraud_risk_label ?? "—")})`,
    );
  }
  if (row.batch_risk_score != null) {
    lines.push(`Batch pressure ${toNum(row.batch_risk_score).toFixed(3)}`);
  }
  if (row.rule_flag_count != null) {
    lines.push(`Rule governance load: ${toNum(row.rule_flag_count)} flags`);
  }
  if (row.hybrid_risk_label) {
    lines.push(`Calibrated label: ${String(row.hybrid_risk_label)}`);
  }
  return lines;
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
        const blob = `${r.compliance_issue ?? ""} ${r.recommended_action ?? ""} ${r.explanation ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [rows, severityFilter, issueQuery]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("review_priority", {
        header: "Priority",
        cell: (ctx) => (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {ctx.getValue() ?? "—"}
          </span>
        ),
        size: 72,
      }),
      columnHelper.accessor("record_id", {
        header: "Declaration",
        cell: (ctx) => (
          <span className="font-mono text-[11px] text-foreground">{ctx.getValue() ?? "—"}</span>
        ),
      }),
      columnHelper.accessor("severity_level", {
        header: "Severity",
        cell: (ctx) => (
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            {ctx.getValue() ?? "—"}
          </Badge>
        ),
      }),
      columnHelper.accessor("hybrid_score", {
        header: () => (
          <span
            title="Dense risk composite — calibrated for routing, not legal determination."
            className="cursor-help border-b border-dotted border-muted-foreground/40"
          >
            Hybrid
          </span>
        ),
        cell: (ctx) => {
          const v = ctx.getValue();
          return (
            <span className="font-mono text-xs tabular-nums">
              {v != null ? v.toFixed(3) : "—"}
            </span>
          );
        },
      }),
      columnHelper.accessor("compliance_issue", {
        header: "Governance finding",
        cell: (ctx) => (
          <span className="max-w-[14rem] text-xs leading-snug text-muted-foreground line-clamp-2">
            {ctx.getValue() ?? "—"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "explainability",
        header: "Narrative",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="xs"
            type="button"
            onClick={() => setBriefingRow(row.original)}
          >
            <FileText className="mr-1 size-3.5" />
            Briefing
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

  if (latest.isPending) {
    return <Skeleton className="h-[480px] w-full rounded-xl" />;
  }

  if (latest.isError) {
    return (
      <Card className="enterprise-surface border-destructive/30">
        <CardContent className="py-10 text-center text-sm text-destructive">
          Review workspace requires a successful screening hydration.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Sheet open={!!briefingRow} onOpenChange={(o) => !o && setBriefingRow(null)}>
        <SheetContent className="w-[min(100vw,28rem)] sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-mono text-sm">
              {briefingRow?.record_id ?? "Decision record"}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[calc(100dvh-8rem)] pr-4">
            <section className="space-y-3 text-sm">
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Operator narrative
                </h4>
                <p className="mt-1 leading-relaxed text-foreground/95">
                  {briefingRow?.explanation ?? "—"}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Routing & disposition hint
                </h4>
                <p className="mt-1 text-sm">{briefingRow?.review_status ?? "—"}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {briefingRow?.recommended_action ?? ""}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Decision signals
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  {signalLines.length === 0 ? (
                    <li>No expanded telemetry on this briefing.</li>
                  ) : (
                    signalLines.map((line) => (
                      <li
                        key={line}
                        className="rounded-md border border-border/60 bg-muted/30 px-2 py-1 text-foreground/90"
                      >
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

      <Card className="enterprise-surface border-border/80 shadow-none">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Operator triage</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Sortable queue · filters · explainability briefing (decision telemetry, not row dumps).
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative">
              <Filter className="pointer-events-none absolute top-2.5 left-2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search governance finding / briefing…"
                className="h-9 w-full min-w-[12rem] pl-8 text-xs sm:w-72"
                value={issueQuery}
                onChange={(e) => setIssueQuery(e.target.value)}
              />
            </div>
            <Select
              value={severityFilter}
              onValueChange={(v) => setSeverityFilter(v ?? "all")}
            >
              <SelectTrigger className="h-9 w-full sm:w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
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
                  <TableRow key={hg.id} className="hover:bg-transparent">
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className={
                              header.column.getCanSort()
                                ? "flex cursor-pointer select-none items-center gap-1 text-left font-semibold hover:text-primary"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
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
                    <TableCell
                      colSpan={columns.length}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      {rows.length === 0
                        ? "No prioritised exposures — hydrate via screening."
                        : "No rows match current filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
