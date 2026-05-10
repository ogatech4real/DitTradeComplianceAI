import type { ReactNode } from "react";

export function MarketingFigure({
  caption,
  children,
  className = "",
}: {
  caption?: string;
  children: ReactNode;
  /** Additional classes for the bordered frame wrapper */
  className?: string;
}) {
  return (
    <figure className={`text-center lg:text-left ${className}`}>
      <div className="overflow-hidden rounded-[1.5rem] border-2 border-[color-mix(in_oklch,var(--primary)_32%,var(--border))] bg-[linear-gradient(178deg,var(--card),color-mix(in_oklch,var(--accent-intelligence-soft)_55%,transparent))] shadow-[0_26px_70px_-40px_color-mix(in_oklch,var(--brand-secondary)_42%,transparent)]">
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-4 max-w-xl text-[13px] leading-snug text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
