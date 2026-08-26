"use client";

import { formatPrice } from "../checkout-data";

function Row({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between text-[0.9rem]">
      <span className={muted ? "text-[var(--merch-secondary)]" : "text-[var(--merch-primary)]"}>
        {label}
      </span>
      <span
        className={
          muted
            ? "tabular-nums text-[var(--merch-secondary)]"
            : "font-semibold tabular-nums text-[var(--merch-primary)]"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function OrderSummary({ items, totals }) {
  const count = items.reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
          Order summary
        </h3>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Line items */}
      <ul className="flex flex-col gap-3">
        {items.map((line) => (
          <li key={line.id} className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--merch-surface)] text-[0.72rem] font-bold uppercase tracking-[-0.02em] text-[var(--merch-primary)]">
              {line.monogram}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold text-[var(--merch-primary)]">
                {line.name}
              </p>
              <p className="text-[0.78rem] text-[var(--merch-secondary)]">
                Size {line.size} · Qty {line.qty}
              </p>
            </div>
            <span className="shrink-0 text-[0.9rem] font-bold tabular-nums text-[var(--merch-primary)]">
              {formatPrice(line.price * line.qty)}
            </span>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="flex flex-col gap-2 border-t border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] pt-4">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} muted />
        <Row
          label="Shipping"
          value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
          muted
        />
        <Row label="Estimated tax" value={formatPrice(totals.tax)} muted />
      </div>

      <div className="flex items-center justify-between border-t border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] pt-4">
        <span className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
          Total
        </span>
        <span className="text-[1.35rem] font-bold tabular-nums tracking-[-0.02em] text-[var(--merch-primary)]">
          {formatPrice(totals.total)}
        </span>
      </div>
    </div>
  );
}
