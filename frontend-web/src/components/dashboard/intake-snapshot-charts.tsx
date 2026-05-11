"use client";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import {
  deriveCountryOfExportTop,
  deriveDeclaredOriginCountryTop,
  deriveHsChapterTop,
  deriveLastTransformationCountryTop,
  deriveMaterialKeywordsTop,
  deriveProductFamilyTop,
  deriveSupplierChainDepthTop,
} from "@/lib/intelligence/decision/cohort-rankings";
import { CohortDimensionBar } from "@/components/dashboard/cohort-dimension-bar";

interface IntakeSnapshotChartsProps {
  payload: ScreeningSuccessResponse;
}

export function IntakeSnapshotCharts({ payload }: IntakeSnapshotChartsProps) {
  const { records } = payload;

  const origin = deriveDeclaredOriginCountryTop(records);
  const exportC = deriveCountryOfExportTop(records);
  const lst = deriveLastTransformationCountryTop(records);
  const depths = deriveSupplierChainDepthTop(records);
  const hs = deriveHsChapterTop(records);
  const families = deriveProductFamilyTop(records);
  const materials = deriveMaterialKeywordsTop(records);

  const dims = [
    { key: "origin", title: "Declared origin country (top 8)", data: origin },
    {
      key: "export",
      title: "Country of export (top 8)",
      data: exportC,
    },
    {
      key: "lst",
      title: "Last substantial transformation country (top 8)",
      data: lst,
    },
    {
      key: "depth",
      title: "Supplier chain depth (top 4 discrete values)",
      data: depths,
    },
    {
      key: "hs",
      title: "HS chapter (2-digit)",
      description: "Inferred when only longer HS/HTS codes are present.",
      data: hs,
    },
    { key: "family", title: "Product family", data: families },
    {
      key: "materials",
      title: "Material keywords",
      description: "Splits comma-/semicolon-separated lists when keywords are bundled in one cell.",
      data: materials,
    },
  ];

  const anyFilled = dims.some((d) => d.data.length > 0);

  if (!anyFilled && records.length > 0) {
    return (
      <section className="space-y-4">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Intake snapshot — ranked columns
          </h3>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
            We could not infer geography, HS, materials, or chain-depth columns from&nbsp;
            <span className="font-medium text-foreground">{records.length}</span>
            &nbsp;scored rows. Confirm canonical field names (
            declared_origin_country, country_of_export, country_of_last_substantial_transformation, supplier_chain_depth,
            hs_code-related fields, material_keywords, …) are present post-canonicalisation.
          </p>
        </div>
      </section>
    );
  }

  if (!anyFilled && records.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Intake snapshot — ranked columns
        </h3>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          Rank-frequency views from the hydrated <span className="font-medium text-foreground">records</span> payload.
          Ties in ranking are deterministic (sort by frequency, then label).
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {dims.map((d, idx) => (
          <CohortDimensionBar
            key={d.key}
            title={d.title}
            description={"description" in d ? d.description : undefined}
            data={d.data}
            chartHeightPx={168}
            barFillVar={chartFill(idx)}
          />
        ))}
      </div>
    </section>
  );
}

function chartFill(i: number): string {
  const vars = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  return vars[i % vars.length];
}
