import { redirect } from "next/navigation";

/** About copy now lives on the home page after the hero; keep old URLs working. */
export default function AboutRedirectPage() {
  redirect("/#about-the-platform");
}
