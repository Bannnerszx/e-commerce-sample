"use client";

import { Check } from "lucide-react";
import { formatPrice } from "../checkout-data";
import { PaypalWordmark } from "./brand-marks";

export function SuccessReceipt({ method, total, orderId, onRestart }) {
  return (
    <div className="flex flex-col items-center px-2 py-8 text-center sm:px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--merch-primary)] text-white">
        <Check size={26} strokeWidth={3} aria-hidden />
      </div>

      <h3 className="mt-5 text-[1.5rem] font-bold tracking-[-0.02em] text-[var(--merch-primary)]">
        Payment complete
      </h3>
      <p className="mt-2 max-w-[42ch] text-[0.9rem] leading-[1.55] text-[var(--merch-secondary)]">
        This is a front-end playground — no real charge was made. You just walked
        the full payment flow end to end.
      </p>

      <dl className="mt-6 w-full max-w-[22rem] overflow-hidden rounded-[14px] border border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] text-left">
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-[0.8rem] text-[var(--merch-secondary)]">Order</dt>
          <dd className="text-[0.85rem] font-semibold tabular-nums text-[var(--merch-primary)]">
            {orderId}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-[color-mix(in_srgb,var(--merch-secondary)_20%,transparent)] px-4 py-3">
          <dt className="text-[0.8rem] text-[var(--merch-secondary)]">Method</dt>
          <dd className="text-[0.85rem] font-semibold text-[var(--merch-primary)]">
            {method === "paypal" ? (
              <PaypalWordmark className="text-[0.9rem]" />
            ) : (
              "Card ···· 4242"
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-[color-mix(in_srgb,var(--merch-secondary)_20%,transparent)] bg-[var(--merch-neutral)] px-4 py-3">
          <dt className="text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--merch-secondary)]">
            Paid
          </dt>
          <dd className="text-[1.05rem] font-bold tabular-nums text-[var(--merch-primary)]">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {/* The single reserved accent action for this screen */}
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
      >
        Run the flow again
      </button>
    </div>
  );
}
