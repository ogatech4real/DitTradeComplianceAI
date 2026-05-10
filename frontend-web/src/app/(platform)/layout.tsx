import type { ReactNode } from "react";

import { PlatformShell } from "@/components/layout/platform-shell";

export default function PlatformSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PlatformShell>{children}</PlatformShell>;
}
