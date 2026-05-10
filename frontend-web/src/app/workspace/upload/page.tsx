import { redirect } from "next/navigation";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

export default function UploadLegacyRedirectPage() {
  redirect(WORKSPACE_ROUTES.home);
}
