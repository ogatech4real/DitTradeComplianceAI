import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MarketingCaptionFigureProps {
  /** Path under `/public`, e.g. `/marketing/hero.jpg` */
  src: string;
  alt: string;
  caption: ReactNode;
  /** Optional short label shown above caption (visually subdued) */
  captionLabel?: string;
  priority?: boolean;
  className?: string;
  /** Aspect ratio wrapper, e.g. aspect-[16/10] */
  aspectClassName?: string;
  imageClassName?: string;
}

/**
 * Accessible figure with headline-style caption overlay for institutional storytelling.
 */
export function MarketingCaptionFigure({
  src,
  alt,
  caption,
  captionLabel,
  priority,
  className,
  aspectClassName = "aspect-[16/10] min-h-[200px]",
  imageClassName,
}: MarketingCaptionFigureProps) {
  return (
    <figure
      className={cn(
        "group relative w-full overflow-hidden rounded-[1.65rem] border-2 border-[color-mix(in_oklch,var(--primary)_35%,var(--border))] bg-muted shadow-[0_30px_80px_-42px_color-mix(in_oklch,var(--brand-secondary)_58%,transparent)]",
        aspectClassName,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width:1024px) 100vw, 50vw"
        className={cn(
          "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
          imageClassName,
        )}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/4 bg-[linear-gradient(to_top,color-mix(in_oklch,var(--foreground)_88%,transparent)_0%,transparent_100%)] opacity-92"
        aria-hidden
      />
      <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-14 sm:px-7 sm:pb-7">
        {captionLabel ? (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.26em] text-white/85">{captionLabel}</p>
        ) : null}
        <div className="text-[14px] font-semibold leading-snug tracking-tight text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)] sm:text-[15px] sm:leading-relaxed">
          {caption}
        </div>
      </figcaption>
    </figure>
  );
}
