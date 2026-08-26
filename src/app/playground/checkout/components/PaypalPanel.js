"use client";

import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { formatPrice } from "../checkout-data";
import { PaypalWordmark } from "./brand-marks";

// Simulated PayPal handoff. Instead of a real redirect, clicking the PayPal
// button reveals an in-box "authorize" card that mimics the PayPal consent
// screen, then hands back to the parent's processing → success flow.
export function PaypalPanel({ total, onPay }) {
  const [stage, setStage] = useState("idle"); // "idle" | "authorize"

  if (stage === "authorize") {
    return (
      <div className="flex flex-col gap-5 rounded-[14px] border border-[color-mix(in_srgb,var(--merch-secondary)_30%,transparent)] bg-[var(--merch-surface)] p-5">
        <div className="flex items-center justify-between">
          <PaypalWordmark className="text-[1.4rem]" />
          <span className="flex items-center gap-1 text-[0.7rem] font-medium text-[var(--merch-secondary)]">
            <Lock size={12} strokeWidth={2.25} aria-hidden />
            paypal.com
          </span>
        </div>

        <div className="rounded-[10px] bg-[var(--merch-neutral)] p-4">
          <p className="text-[0.85rem] text-[var(--merch-secondary)]">
            Logged in as
          </p>
          <p className="text-[0.95rem] font-semibold text-[var(--merch-primary)]">
            alex.runner@example.com
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] pt-3">
            <span className="text-[0.85rem] text-[var(--merch-secondary)]">
              Ship to · Pay BAN Merch
            </span>
            <span className="text-[0.95rem] font-bold tabular-nums text-[var(--merch-primary)]">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* The single reserved accent action for this screen */}
        <button
          type="button"
          onClick={onPay}
          className="rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3.5 text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
        >
          Authorize &amp; Pay {formatPrice(total)}
        </button>

        <button
          type="button"
          onClick={() => setStage("idle")}
          className="inline-flex items-center justify-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[var(--merch-secondary)] transition-colors hover:text-[var(--merch-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
        >
          <ArrowLeft size={14} strokeWidth={2.5} aria-hidden />
          Cancel and return
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[14px] border border-dashed border-[color-mix(in_srgb,var(--merch-secondary)_40%,transparent)] bg-[var(--merch-neutral)] p-5 text-center">
        <PaypalWordmark className="text-[1.6rem]" />
        <p className="mt-2 text-[0.85rem] leading-[1.55] text-[var(--merch-secondary)]">
          You&apos;ll confirm your payment with PayPal, then come right back to
          finish your order.
        </p>
      </div>

      {/* The single reserved accent action for this screen */}
      <button
        type="button"
        onClick={() => setStage("authorize")}
        className="flex items-center justify-center gap-2 rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3.5 text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
      >
        Pay with <PaypalWordmark className="text-[1rem] !text-white [&>span]:text-white" />
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[0.72rem] text-[var(--merch-secondary)]">
        <Lock size={12} strokeWidth={2.25} aria-hidden />
        Simulated handoff · no real account is used
      </p>
    </div>
  );
}
