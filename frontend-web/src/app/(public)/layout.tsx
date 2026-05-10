import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function PublicSiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="public-site dark relative isolate flex min-h-dvh flex-col bg-background text-foreground"
      style={{
        backgroundImage: "var(--mesh-b), var(--mesh-c), var(--mesh-a)",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
