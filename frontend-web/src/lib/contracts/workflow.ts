/**
 * Frontend workflow taxonomy — aligns with frontend_api_contract.md lifecycle §4.
 * Server does not yet expose durable workflow_id; this models UI + future async orchestration.
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
  { id: "idle", label: "Idle", description: "Awaiting dataset or operator action." },
  {
    id: "upload_dataset",
    label: "Upload dataset",
    description: "Secure intake of declarations / supplementary evidence.",
  },
  {
    id: "schema_intelligence",
    label: "Schema intelligence",
    description: "Mapping confidence vs required screening fields.",
  },
  {
    id: "icc_transformation",
    label: "ICC transformation",
    description: "ICC-aligned canonical alignment and enrichment.",
  },
  {
    id: "data_quality_validation",
    label: "Data quality validation",
    description: "Completeness, coercion, consistency signals.",
  },
  {
    id: "fraud_analysis",
    label: "Fraud intelligence",
    description: "Pattern-level fraud indicators per record.",
  },
  {
    id: "batch_analysis",
    label: "Batch intelligence",
    description: "Duplicate, concentration, and cluster anomalies.",
  },
  {
    id: "hybrid_scoring",
    label: "Hybrid scoring",
    description: "ML + rules + interaction composition.",
  },
  {
    id: "risk_classification",
    label: "Risk classification",
    description: "Severity, routing, and recommended actions.",
  },
  {
    id: "review_queue",
    label: "Review queue",
    description: "Prioritised operational triage set.",
  },
  {
    id: "explainability",
    label: "Explainability",
    description: "Operator narratives and contributor evidence.",
  },
  {
    id: "export_audit",
    label: "Export & audit",
    description: "Evidence bundles and governance exports.",
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
  /** Future: server-issued id */
  workflowId: string | null;
  status: WorkflowRunStatus;
  /** Highest completed / active phase for UI rail */
  activePhaseId: WorkflowPhaseId;
  /** Monotonic client tick for animations */
  updatedAt: number;
}
