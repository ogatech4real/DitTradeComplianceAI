import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function PublicSiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[color-mix(in_oklch,var(--marketing-canvas)_78%,transparent)] text-foreground backdrop-blur-[2px]">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
