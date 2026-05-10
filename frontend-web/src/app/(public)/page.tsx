import type { Metadata } from "next";

import { PublicHomePage } from "@/components/marketing/public-home-page";

export const metadata: Metadata = {
  title: {
    absolute: "Digital Trade Compliance Intelligence",
  },
  description:
    "AI-assisted digital trade screening, explainable governance analytics, and hybrid orchestration anchored to interoperable ICC trade data discipline.",
};

export default function InstitutionalHomepage() {
  return <PublicHomePage />;
}
