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
            className="border-amber-500/35 bg-amber-500/[0.08] font-mono text-[10px] uppercase"
          >
            Mock
          </Badge>
        ) : null}
        <Badge variant="secondary" className="gap-1.5 font-normal">
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          API handshake
        </Badge>
      </div>
    );
  }

  if (q.isError) {
    return (
      <span
        title="Confirm NEXT_PUBLIC_API_BASE_URL on Vercel matches your FastAPI origin and that CORS allows this host (or enable NEXT_PUBLIC_USE_MOCK_API)."
        className="inline-flex cursor-help flex-wrap items-center gap-2"
      >
        {mock ? (
          <Badge
            variant="outline"
            className="border-amber-500/35 bg-amber-500/[0.08] font-mono text-[10px] uppercase"
          >
            Mock
          </Badge>
        ) : null}
        <Badge variant="destructive" className="font-normal">
          Backend offline
        </Badge>
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {mock ? (
        <Badge
          variant="outline"
          className="border-amber-500/35 bg-amber-500/[0.08] font-mono text-[10px] uppercase"
        >
          Mock
        </Badge>
      ) : null}
      <Badge
        variant="outline"
        className="border-emerald-500/35 bg-emerald-500/[0.12] font-normal text-emerald-200"
      >
        API {q.data?.status ?? "ok"}
      </Badge>
    </div>
  );
}
