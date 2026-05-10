"use client";

import { DashboardDecisionSurface } from "@/components/dashboard/dashboard-decision-surface";
import { WorkflowStatusRail } from "@/components/workflow/workflow-status-rail";

export default function DashboardPage() {
  return (
    <div className="mx-auto grid max-w-[1460px] gap-10 lg:grid-cols-12">
      <div className="min-w-0 space-y-10 lg:col-span-8 xl:col-span-9">
        <DashboardDecisionSurface />
      </div>
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="lg:sticky lg:top-[5.5rem]">
          <WorkflowStatusRail />
        </div>
      </div>
    </div>
  );
}
