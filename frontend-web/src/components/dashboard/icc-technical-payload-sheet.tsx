"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Braces, ClipboardCopy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

const CANONICAL_PREVIEW_COUNT = 35;

function stringifyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{"error":"serialization_failed"}';
  }
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function IccTechnicalPayloadSheet({ payload }: { payload: ScreeningSuccessResponse }) {
  const [open, setOpen] = useState(false);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const hintClear = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function flashCopy(text: string, okMessage: string) {
    if (hintClear.current != null) {
      clearTimeout(hintClear.current);
    }
    const ok = await writeClipboard(text);
    setCopyHint(ok ? okMessage : "Copy blocked — browser denied clipboard.");
    hintClear.current = setTimeout(() => setCopyHint(null), 2600);
  }

  const iccRows = useMemo(() => {
    return payload.records.map((r, i) => {
      const recordId = String(r.record_id ?? `index_${i}`);
      const icc = r.icc ?? r.ICC;
      return { record_id: recordId, icc };
    });
  }, [payload.records]);

  const iccOnly = useMemo(
    () =>
      iccRows.filter(
        (row) => row.icc != null && (typeof row.icc === "object" || typeof row.icc === "string"),
      ),
    [iccRows],
  );

  const iccJson = useMemo(() => stringifyJson(iccOnly.length ? iccOnly : []), [iccOnly]);

  const canonicalPreview = useMemo(
    () => payload.records.slice(0, CANONICAL_PREVIEW_COUNT),
    [payload.records],
  );

  const canonicalPreviewJson = useMemo(
    () =>
      stringifyJson({
        preview_note: `First ${canonicalPreview.length} of ${payload.records.length} scored rows.`,
        preview_rows: canonicalPreview,
      }),
    [canonicalPreview, payload.records.length],
  );

  const fullRecordsJson = useMemo(() => stringifyJson(payload.records), [payload.records]);

  const envelopeJson = useMemo(
    () =>
      stringifyJson({
        upload_summary: payload.upload_summary,
        screening_summary: payload.screening_summary,
        processing_metadata: payload.processing_metadata,
        system_insights: payload.system_insights,
        severity_breakdown: payload.severity_breakdown,
        model_packaging_hints: {
          fraud_analysis: payload.fraud_analysis,
          batch_analysis: payload.batch_analysis,
        },
      }),
    [payload],
  );

  const hasRecords = payload.records.length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger nativeButton={false} render={<Button type="button" variant="outline" size="sm" />}>
        <Braces className="mr-1.5 size-4 shrink-0" aria-hidden />
        View technical ICC-normalised payload
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton
        className="workspace-app public-site dark marketing-warm flex w-[min(100vw,540px)] max-w-none flex-col border-border/65 bg-background p-0 text-foreground"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-5 text-left">
          <SheetTitle className="font-[family-name:var(--font-heading)] text-lg leading-snug tracking-tight">
            Technical ICC-normalised payload
          </SheetTitle>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            Inspect nested ICC artefacts when present, preview canonical scored rows returned by orchestration, and copy
            the processing envelope for engineering or audit artefacts. Rows are verbatim from&nbsp;
            <span className="font-medium text-foreground">records[]</span> on the screening response — not rewritten by
            the UI.
          </p>
          {!hasRecords ? (
            <p className="mt-2 rounded-lg border border-border/65 bg-muted/30 px-3 py-2 text-[13px] text-amber-200/90 dark:text-[color-mix(in_oklch,var(--semantic-amber)_75%,white_25%)]">
              No <code className="text-xs">records</code> array in this session — rerun screening or reload latest results
              when the API emits full rows.
            </p>
          ) : null}
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4">
          <Tabs defaultValue="icc" className="flex min-h-0 flex-1 flex-col gap-4">
            <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-y-2 py-2">
              <TabsTrigger value="icc">Nested ICC objects</TabsTrigger>
              <TabsTrigger value="canonical">Canonical records</TabsTrigger>
              <TabsTrigger value="envelope">Processing envelope</TabsTrigger>
            </TabsList>

            <TabsContent value="icc" className="min-h-0 flex-1">
              <PayloadPanel
                title="ICC nesting"
                subtitle={
                  iccOnly.length === 0
                    ? `No nested icc key on scored rows (${payload.records.length} rows) — payloads may already be flattened to canonical columns.`
                    : `${iccOnly.length} row${iccOnly.length === 1 ? "" : "s"} carry ICC-shaped JSON. Flattened fields still appear under Canonical records.`
                }
                jsonText={iccJson}
                onCopy={() => void flashCopy(iccJson, "ICC JSON copied.")}
              />
            </TabsContent>

            <TabsContent value="canonical" className="min-h-0 flex-1">
              <PayloadPanel
                title="Canonical scored preview"
                subtitle={
                  payload.records.length > CANONICAL_PREVIEW_COUNT
                    ? `Preview caps at ${CANONICAL_PREVIEW_COUNT} rows (${payload.records.length} total). Use Copy full cohort for the complete JSON array.`
                    : `All ${payload.records.length} cohort rows listed in order returned by orchestration.`
                }
                jsonText={canonicalPreviewJson}
                onCopy={() => void flashCopy(canonicalPreviewJson, "Preview JSON copied.")}
                extra={
                  payload.records.length > CANONICAL_PREVIEW_COUNT ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="mt-3 w-full gap-1.5"
                      onClick={() =>
                        void flashCopy(fullRecordsJson, `Full cohort (${payload.records.length} rows) copied.`)
                      }
                    >
                      <ClipboardCopy className="size-4 shrink-0" aria-hidden />
                      Copy full records[] JSON ({payload.records.length} rows)
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="mt-3 w-full gap-1.5"
                      onClick={() => void flashCopy(fullRecordsJson, "Records JSON copied.")}
                    >
                      <ClipboardCopy className="size-4 shrink-0" aria-hidden />
                      Copy full records JSON
                    </Button>
                  )
                }
              />
            </TabsContent>

            <TabsContent value="envelope" className="min-h-0 flex-1">
              <PayloadPanel
                title="Processing envelope"
                subtitle={"Upload summary, screening summary, IQ metadata, and aggregate intelligence packaging."}
                jsonText={envelopeJson}
                onCopy={() => void flashCopy(envelopeJson, "Envelope JSON copied.")}
              />
            </TabsContent>
          </Tabs>
          {copyHint ? (
            <p className="mt-2 text-center text-[12px] text-muted-foreground" role="status" aria-live="polite">
              {copyHint}
            </p>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PayloadPanel({
  title,
  subtitle,
  jsonText,
  onCopy,
  extra,
}: {
  title: string;
  subtitle: string;
  jsonText: string;
  onCopy: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="flex min-h-[min(72vh,640px)] flex-1 flex-col gap-3">
      <div>
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>
      <Button type="button" size="sm" variant="outline" className="w-fit shrink-0 gap-1.5 self-start" onClick={onCopy}>
        <ClipboardCopy className="size-4" aria-hidden />
        Copy visible JSON
      </Button>
      {extra ?? null}
      <ScrollArea className="min-h-[14rem] flex-1 rounded-lg border border-border/70 bg-[color-mix(in_oklch,var(--card)_94%,transparent)]">
        <pre className="p-4 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
          <code>{jsonText}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
