import { create } from "zustand";

import {
  WORKFLOW_PHASE_METADATA,
  type WorkflowPhaseId,
  type WorkflowRunStatus,
} from "@/lib/contracts/workflow";

const PHASE_ORDER: WorkflowPhaseId[] = WORKFLOW_PHASE_METADATA.map((p) => p.id);

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
  /** Manual rail navigation — does not mutate pipeline results */
  stepPhaseForward: () => void;
  stepPhaseBackward: () => void;
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
  stepPhaseForward: () =>
    set((s) => {
      const i = PHASE_ORDER.indexOf(s.activePhaseId);
      const from = i < 0 ? 0 : i;
      const next = Math.min(PHASE_ORDER.length - 1, from + 1);
      return { activePhaseId: PHASE_ORDER[next] };
    }),
  stepPhaseBackward: () =>
    set((s) => {
      const i = PHASE_ORDER.indexOf(s.activePhaseId);
      const from = i < 0 ? 0 : i;
      const prev = Math.max(0, from - 1);
      return { activePhaseId: PHASE_ORDER[prev] };
    }),
}));
