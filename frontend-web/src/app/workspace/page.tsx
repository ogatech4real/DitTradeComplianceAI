import { ExecutiveIntelligenceSurface } from "@/components/workspace/executive-intelligence-surface";
import { OperationalIngestPanel } from "@/components/workspace/operational-ingest-panel";

export default function OperationalWorkspaceHomePage() {
  return (
    <div className="mx-auto max-w-[1460px] space-y-12 pb-12">
      <section aria-label="Overview and posture" className="space-y-0">
        <ExecutiveIntelligenceSurface />
      </section>
      <section
        aria-label="Import declarations and run screening"
        id="import-screen"
        className="scroll-mt-28 border-t border-border/40 pt-12"
      >
        <OperationalIngestPanel />
      </section>
    </div>
  );
}
