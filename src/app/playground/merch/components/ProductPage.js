"use client";

import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { cn } from "../../map/lib/cn";
import { formatPrice } from "../merch-data";

export function ProductPage({ product, onBack, onAddToCart }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const increment = () => setQty((q) => Math.min(9, q + 1));

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex w-fit items-center gap-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-[var(--merch-secondary)] transition-colors hover:text-[var(--merch-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
      >
        <ArrowLeft size={15} strokeWidth={2.5} aria-hidden />
        Back to shop
      </button>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
        {/* Flat monogram gallery tile */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] bg-[var(--merch-neutral)]">
          <span
            aria-hidden
            className="select-none text-[clamp(3rem,12vw,6rem)] font-bold uppercase tracking-[-0.04em] text-[var(--merch-primary)]"
          >
            {product.monogram}
          </span>
          <span className="absolute bottom-4 left-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
            BAN · {product.color}
          </span>
        </div>

        {/* Detail column */}
        <div className="flex min-w-0 flex-col">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
            {product.category}
          </span>
          <h3 className="mt-2 text-[clamp(1.6rem,4vw,2.2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--merch-primary)]">
            {product.name}
          </h3>
          <p className="mt-3 text-[1.25rem] font-bold text-[var(--merch-primary)]">
            {formatPrice(product.price)}
          </p>

          <p className="mt-4 max-w-[46ch] text-[0.9rem] leading-[1.55] text-[var(--merch-secondary)]">
            {product.blurb}
          </p>

          {/* Size picker */}
          <div className="mt-6">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
              Size
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={cn(
                    "min-w-[3rem] rounded-[8px] border px-3 py-2 text-[0.85rem] font-semibold uppercase tracking-[0.04em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]",
                    size === s
                      ? "border-[var(--merch-primary)] bg-[var(--merch-primary)] text-white"
                      : "border-[color-mix(in_srgb,var(--merch-secondary)_45%,transparent)] bg-[var(--merch-surface)] text-[var(--merch-primary)] hover:border-[var(--merch-primary)]"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-[14px] border border-[color-mix(in_srgb,var(--merch-secondary)_45%,transparent)]">
              <button
                type="button"
                onClick={decrement}
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                className="flex h-11 w-11 items-center justify-center text-[var(--merch-primary)] disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
              >
                <Minus size={16} strokeWidth={2.5} aria-hidden />
              </button>
              <span
                aria-live="polite"
                className="w-8 text-center text-[0.95rem] font-semibold tabular-nums text-[var(--merch-primary)]"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={increment}
                aria-label="Increase quantity"
                disabled={qty >= 9}
                className="flex h-11 w-11 items-center justify-center text-[var(--merch-primary)] disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
              >
                <Plus size={16} strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            {/* The single reserved accent action for this screen — wraps to a
                full-width row beneath the stepper when space is tight (mobile) */}
            <button
              type="button"
              onClick={() => onAddToCart(product, size, qty)}
              className="flex-1 basis-[13rem] rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
            >
              Add to cart — {formatPrice(product.price * qty)}
            </button>
          </div>

          {/* Details */}
          <ul className="mt-7 flex flex-col gap-2 border-t border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] pt-5">
            {product.details.map((detail) => (
              <li
                key={detail}
                className="flex items-start gap-2 text-[0.85rem] text-[var(--merch-secondary)]"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--merch-secondary)]"
                />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
