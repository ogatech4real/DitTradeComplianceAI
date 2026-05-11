/** Augment demo/mock rows only — never override fields already present from the API. */
export function enrichDemoIntakeDims(records: Record<string, unknown>[]): Record<string, unknown>[] {
  const hsVariants = ["7208", "7601", "2501", "6810", "8407", "4002", "2601", "2710"];
  const materials = [
    "steel; alloy coatings",
    "aluminum; recycled content",
    "cement; clinker sulfur trace",
    "organic basis; solvents",
    "battery grade nickel; cobalt",
    "textiles; dyed cotton",
    "graphite composite",
    "soy derivatives",
  ];

  return records.map((row, i) => {
    const origin = row.declared_origin_country ? String(row.declared_origin_country) : undefined;
    const dest =
      row.destination_country != null
        ? String(row.destination_country)
        : row.destination_market != null
          ? String(row.destination_market)
          : undefined;

    const out = { ...row };

    if (out.country_of_export == null || String(out.country_of_export).trim() === "") {
      out.country_of_export = dest ?? origin ?? "UNKNOWN";
    }
    if (
      out.country_of_last_substantial_transformation == null ||
      String(out.country_of_last_substantial_transformation).trim() === ""
    ) {
      const pool = ["VN", "TR", "ID", origin, dest].filter((x): x is string => Boolean(x && String(x).trim()));
      out.country_of_last_substantial_transformation = pool[i % pool.length] ?? "VN";
    }
    if (out.supplier_chain_depth == null || String(out.supplier_chain_depth).trim() === "") {
      out.supplier_chain_depth = String(1 + (i % 4));
    }
    if (
      firstMissing(out, [
        "hs_code",
        "hs_chapter_2_digit",
        "harmonized_system_chapter_2_digit",
      ])
    ) {
      out.hs_code = `${hsVariants[i % hsVariants.length]}${100 + ((i * 17) % 900)}`;
    }
    if (out.material_keywords == null || String(out.material_keywords).trim() === "") {
      out.material_keywords = materials[i % materials.length];
    }

    return out;
  });
}

function firstMissing(row: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((k) => row[k] == null || String(row[k]).trim() === "");
}
