import { create } from "zustand";

import type { WorkflowPhaseId, WorkflowRunStatus } from "@/lib/contracts/workflow";

interface WorkflowUiState {
  status: WorkflowRunStatus;
  activePhaseId: WorkflowPhaseId;
  workflowId: string | null;
  /** Human-readable sub-step for progress UI */
  pipelineMessage: string | null;
  setStatus: (s: WorkflowRunStatus) => void;
  setActivePhase: (id: WorkflowPhaseId) => void;
  setWorkflowId: (id: string | null) => void;
  setPipelineMessage: (msg: string | null) => void;
  reset: () => void;
}

const initial = {
  status: "idle" as WorkflowRunStatus,
  activePhaseId: "idle" as WorkflowPhaseId,
  workflowId: null as string | null,
  pipelineMessage: null as string | null,
};

export const useWorkflowUiStore = create<WorkflowUiState>((set) => ({
  ...initial,
  setStatus: (status) => set({ status }),
  setActivePhase: (activePhaseId) => set({ activePhaseId }),
  setWorkflowId: (workflowId) => set({ workflowId }),
  setPipelineMessage: (pipelineMessage) => set({ pipelineMessage }),
  reset: () => set({ ...initial }),
}));
