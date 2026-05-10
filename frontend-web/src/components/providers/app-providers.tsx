"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { ApiHttpError } from "@/lib/api/errors";
import { TooltipProvider } from "@/components/ui/tooltip";

function shouldRetryQuery(failureCount: number, error: Error): boolean {
  if (error instanceof ApiHttpError) {
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    return failureCount < 2;
  }
  return failureCount < 2;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: shouldRetryQuery,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delay={200}>{children}</TooltipProvider>
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  );
}
