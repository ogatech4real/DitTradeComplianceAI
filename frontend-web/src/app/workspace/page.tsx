import { ExecutiveIntelligenceSurface } from "@/components/workspace/executive-intelligence-surface";
import { OperationalIngestPanel } from "@/components/workspace/operational-ingest-panel";

export default function OperationalWorkspaceHomePage() {
  return (
    <div className="mx-auto max-w-[1460px] space-y-10 pb-12">
      <ExecutiveIntelligenceSurface />
      <div id="import-screen" className="scroll-mt-28">
        <OperationalIngestPanel />
      </div>
    </div>
  );
}
