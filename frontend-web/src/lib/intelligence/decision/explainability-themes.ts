import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

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
    patterns: [/compliance inconsistencies/i, /rule/i, /violations/i],
    hint: "Multi-flag records — route to rules-of-origin / valuation specialist lane.",
  },
  {
    id: "Fraud & pattern risk",
    patterns: [/contradictory origin/i, /cohort/i, /fraud/i, /anomal/i],
    hint: "Cross-check documents; consider enhanced documentary review.",
  },
  {
    id: "Cleared baseline",
    patterns: [/passed standard compliance screening/i],
    hint: "Spot-check only — maintain audit sampling.",
  },
];

function classifyExplanation(text: string): string {
  for (const rule of THEME_RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      return rule.id;
    }
  }
  return "Operational narrative (other)";
}

/**
 * Clusters **operator explanations** into governance themes — never raw column dumps.
 */
export function deriveExplainabilityThemes(
  payload: ScreeningSuccessResponse,
): ExplainabilityThemeInsight[] {
  const explanations = payload.records
    .map((r) => String(r.explanation ?? "").trim())
    .filter(Boolean);

  if (explanations.length === 0) return [];

  const buckets = new Map<string, number>();
  for (const ex of explanations) {
    const theme = classifyExplanation(ex);
    buckets.set(theme, (buckets.get(theme) ?? 0) + 1);
  }

  const total = explanations.length;
  const insights: ExplainabilityThemeInsight[] = [];

  for (const [theme, count] of buckets) {
    const rule = THEME_RULES.find((r) => r.id === theme);
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
