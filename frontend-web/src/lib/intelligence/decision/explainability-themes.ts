import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { buildOperatorRiskDrivers } from "@/lib/intelligence/decision/operator-risk-drivers";

export interface ExplainabilityThemeInsight {
  theme: string;
  count: number;
  sharePercent: number;
  decisionHint: string;
}

const THEME_RULES: { id: string; patterns: RegExp[]; hint: string }[] = [
  {
    id: "Traceability evidence",
    patterns: [/traceability/i, /documentation gap/i, /weak supply-chain/i],
    hint: "Prioritise chain-of-custody evidence and supplier attestations.",
  },
  {
    id: "Carbon & emissions posture",
    patterns: [/emissions/i, /carbon/i, /embedded/i],
    hint: "Validate CBAM / carbon disclosure consistency vs declared methodology.",
  },
  {
    id: "Rule governance load",
    patterns: [/compliance inconsistencies/i, /rule hit/i, /violations/i],
    hint: "Multi-flag records — route to rules-of-origin / valuation specialist lane.",
  },
  {
    id: "Fraud & pattern risk",
    patterns: [/contradictory origin/i, /cohort/i, /fraud/i, /anomal/i],
    hint: "Cross-check documents; consider enhanced documentary review.",
  },
  {
    id: "Batch & cohort pressure",
    patterns: [/batch cluster/i, /higher-risk batch/i],
    hint: "Examine corridor concentration and duplicated logistics signals across the batch lane.",
  },
  {
    id: "Cleared baseline",
    patterns: [/passed standard compliance screening/i, /lower-priority/i],
    hint: "Spot-check only — maintain audit sampling.",
  },
];

function classifyExplanation(text: string): string {
  const t = text.trim();
  if (!t) return "Operational narrative (other)";
  for (const rule of THEME_RULES) {
    if (rule.patterns.some((p) => p.test(t))) {
      return rule.id;
    }
  }
  return "Operational narrative (other)";
}

/**
 * When `records[].explanation` is terse (backend `build_operator_explanation`), fall back
 * to SignalTier drivers aligned with Streamlit queue copy (fraud / batch / anomaly).
 */
function classifyFromDrivers(record: Record<string, unknown>): string | null {
  const drivers = buildOperatorRiskDrivers(record);
  const joined = drivers.join(" ").toLowerCase();

  if (joined.includes("fraud pattern")) return "Fraud & pattern risk";
  if (joined.includes("batch cluster")) return "Batch & cohort pressure";
  if (joined.includes("anomaly pattern")) return "Fraud & pattern risk";
  if (joined.includes("rule hit")) return "Rule governance load";
  if (joined.includes("lower-priority")) return "Cleared baseline";
  return null;
}

/** One primary governance bucket per record — keeps cohort shares summing sensibly across rows. */
function primaryThemeForRecord(record: Record<string, unknown>): string {
  const expl = classifyExplanation(String(record.explanation ?? ""));
  if (expl !== "Operational narrative (other)") return expl;

  const fromSignals = classifyFromDrivers(record);
  return fromSignals ?? "Operational narrative (other)";
}

/**
 * Clusters cohort explainability posture: backend narrative first, Streamlit-aligned
 * telemetry drivers second — never raw column grids.
 */
export function deriveExplainabilityThemes(
  payload: ScreeningSuccessResponse,
): ExplainabilityThemeInsight[] {
  const records = payload.records ?? [];
  if (records.length === 0) return [];

  const buckets = new Map<string, number>();

  for (const r of records) {
    const theme = primaryThemeForRecord(r as Record<string, unknown>);
    buckets.set(theme, (buckets.get(theme) ?? 0) + 1);
  }

  const total = records.length;
  const insights: ExplainabilityThemeInsight[] = [];

  for (const [theme, count] of buckets) {
    const rule = THEME_RULES.find((ruleItem) => ruleItem.id === theme);
    insights.push({
      theme,
      count,
      sharePercent: Math.round((count / total) * 1000) / 10,
      decisionHint:
        rule?.hint ??
        "Apply standard desk review; capture disposition reason in audit trail.",
    });
  }

  return insights.sort((a, b) => b.count - a.count);
}
