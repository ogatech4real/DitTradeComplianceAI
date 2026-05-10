/**
 * Frontend workflow taxonomy — mirrors screening lifecycle semantics in `frontend_api_contract.md`.
 * Durable workflow identifiers may arrive from the API later; this drives UI clarity today.
 */

export const WORKFLOW_PHASES = [
  "idle",
  "upload_dataset",
  "schema_intelligence",
  "icc_transformation",
  "data_quality_validation",
  "fraud_analysis",
  "batch_analysis",
  "hybrid_scoring",
  "risk_classification",
  "review_queue",
  "explainability",
  "export_audit",
] as const;

export type WorkflowPhaseId = (typeof WORKFLOW_PHASES)[number];

export interface WorkflowPhaseMeta {
  id: WorkflowPhaseId;
  label: string;
  description: string;
}

export const WORKFLOW_PHASE_METADATA: WorkflowPhaseMeta[] = [
  { id: "idle", label: "Ready", description: "Waiting for a file import or supervised reset." },
  {
    id: "upload_dataset",
    label: "Secure intake",
    description: "Declaration file accepted, hashed, and bound to this session.",
  },
  {
    id: "schema_intelligence",
    label: "Field alignment",
    description: "Column mapping confidence against screening schema expectations.",
  },
  {
    id: "icc_transformation",
    label: "Trade alignment",
    description: "Canonical trade alignment and enrichment consistent with ICC trade data practice.",
  },
  {
    id: "data_quality_validation",
    label: "Data fitness",
    description: "Validation of completeness, types, coercions, and contradiction checks.",
  },
  {
    id: "fraud_analysis",
    label: "Fraud intelligence",
    description: "Per-record fraud indicators surfaced for governance overlays.",
  },
  {
    id: "batch_analysis",
    label: "Batch analytics",
    description: "Cohort anomalies such as duplication, clustering, or concentration bursts.",
  },
  {
    id: "hybrid_scoring",
    label: "Calibrated scoring",
    description: "Combined models and deterministic rules converge on a calibrated risk posture.",
  },
  {
    id: "risk_classification",
    label: "Severity disposition",
    description: "Final severity tiering and reviewer routing cues.",
  },
  {
    id: "review_queue",
    label: "Review preparation",
    description: "Work queue hydrated with investigative context for operators.",
  },
  {
    id: "explainability",
    label: "Narratives & rationale",
    description: "Operator-facing explanations and thematic drivers consolidated.",
  },
  {
    id: "export_audit",
    label: "Release & audit",
    description: "Outputs exposed to dashboards with trace suitable for escalation packets.",
  },
];

export type WorkflowRunStatus =
  | "idle"
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "partial";

export interface WorkflowSessionSnapshot {
  /** Future server-issued orchestration identifier */
  workflowId: string | null;
  status: WorkflowRunStatus;
  /** Highest visible phase for timeline presentation */
  activePhaseId: WorkflowPhaseId;
  /** Client tick driving subtle motion */
  updatedAt: number;
}
