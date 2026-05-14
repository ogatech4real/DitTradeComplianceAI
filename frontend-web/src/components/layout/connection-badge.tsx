"use client";

import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useHealthQuery } from "@/hooks/use-health-query";
import { shouldUseMockApi } from "@/lib/api/mock-mode";

export function ConnectionBadge() {
  const q = useHealthQuery(true);
  const mock = shouldUseMockApi();

  if (q.isPending) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {mock ? (
          <Badge
            variant="outline"
            className="border-[var(--semantic-amber)]/35 bg-[var(--semantic-amber)]/[0.12] text-[10px] font-medium tracking-wide text-[var(--semantic-amber-fg)]"
          >
            Demo connectivity
          </Badge>
        ) : null}
        <Badge variant="secondary" className="gap-1.5 font-normal">
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          Checking services…
        </Badge>
      </div>
    );
  }

  if (q.isError) {
    return (
      <span
        title="Verify the API base URL in your deployment settings and confirm the screening service permits this browser origin."
        className="inline-flex cursor-help flex-wrap items-center gap-2"
      >
        {mock ? (
          <Badge
            variant="outline"
            className="border-[var(--semantic-amber)]/35 bg-[var(--semantic-amber)]/[0.12] text-[10px] font-medium tracking-wide text-[var(--semantic-amber-fg)]"
          >
            Demo connectivity
          </Badge>
        ) : null}
        <Badge variant="destructive" className="font-normal">
          Screening service unreachable
        </Badge>
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {mock ? (
        <Badge
          variant="outline"
          className="border-[var(--semantic-amber)]/35 bg-[var(--semantic-amber)]/[0.12] text-[10px] font-medium tracking-wide text-[var(--semantic-amber-fg)]"
        >
          Demo connectivity
        </Badge>
      ) : null}
      <Badge
        variant="outline"
        className="border-[var(--semantic-emerald)]/35 bg-[var(--semantic-emerald-soft)]/80 font-normal text-foreground"
        title={q.data?.status ? `API status: ${q.data.status}` : "API reachable"}
      >
        API Connected
      </Badge>
    </div>
  );
}
