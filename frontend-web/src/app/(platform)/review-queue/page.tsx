"use client";

import { OperatorReviewWorkspace } from "@/components/review/operator-review-workspace";

export default function ReviewQueuePage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <OperatorReviewWorkspace />
    </div>
  );
}
