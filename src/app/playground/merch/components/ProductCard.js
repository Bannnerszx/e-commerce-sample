"use client";

import { cn } from "../../map/lib/cn";
import { formatPrice } from "../merch-data";

// Flat monogram tile — no gradients, no assets (per COMMERCE-DESIGN.md).
function ProductTile({ monogram }) {
  return (
    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[14px] bg-[var(--merch-neutral)]">
      <span
        aria-hidden
        className="select-none text-[clamp(2rem,7vw,3.25rem)] font-bold uppercase tracking-[-0.04em] text-[var(--merch-primary)]"
      >
        {monogram}
      </span>
      <span className="absolute bottom-3 left-3 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
        BAN
      </span>
    </div>
  );
}

export function ProductCard({ product, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(product.id)}
      className={cn(
        "group flex min-w-0 flex-col gap-3 rounded-[24px] bg-[var(--merch-surface)] p-3 text-left",
        "border border-[color-mix(in_srgb,var(--merch-secondary)_35%,transparent)]",
        "transition-transform duration-200 hover:-translate-y-0.5",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
      )}
    >
      <div className="relative">
        <ProductTile monogram={product.monogram} />
        {product.tag ? (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--merch-primary)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white">
            {product.tag}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-1 px-1 pb-1">
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
          {product.category}
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="min-w-0 text-[0.98rem] font-semibold leading-tight tracking-[-0.01em] text-[var(--merch-primary)]">
            {product.name}
          </h4>
          <span className="shrink-0 text-[0.95rem] font-bold text-[var(--merch-primary)]">
            {formatPrice(product.price)}
          </span>
        </div>
        <span className="mt-1 text-[0.8rem] font-medium text-[var(--merch-secondary)] underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-[var(--merch-primary)] group-hover:text-[var(--merch-primary)]">
          View product →
        </span>
      </div>
    </button>
  );
}
