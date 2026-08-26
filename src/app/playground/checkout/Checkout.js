"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { ORDER_ITEMS, getTotals } from "./checkout-data";
import { OrderSummary } from "./components/OrderSummary";
import { MethodToggle } from "./components/MethodToggle";
import { CardForm } from "./components/CardForm";
import { PaypalPanel } from "./components/PaypalPanel";
import { SuccessReceipt } from "./components/SuccessReceipt";

// Local design tokens from COMMERCE-DESIGN.md ("Running Kilometer"), scoped to
// this playground so the surrounding indigo site theme is neither inherited
// nor leaked into — same approach as the BAN Merch storefront playground.
const merchTheme = {
  "--merch-primary": "#151818",
  "--merch-secondary": "#6A7272",
  "--merch-tertiary": "#FF5E1A",
  "--merch-neutral": "#F4F5F2",
  "--merch-surface": "#FFFFFF",
  fontFamily: "var(--font-outfit), system-ui, sans-serif",
};

function newOrderId() {
  return "BAN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function Checkout() {
  const [method, setMethod] = useState("card"); // "card" | "paypal"
  const [stage, setStage] = useState("form"); // "form" | "processing" | "success"
  const [orderId, setOrderId] = useState(null);
  const timerRef = useRef(null);

  const totals = getTotals(ORDER_ITEMS);

  // Both payment paths converge here: a brief simulated processing step, then
  // the receipt. No network — the delay just makes the transition legible.
  const pay = useCallback(() => {
    setStage("processing");
    timerRef.current = setTimeout(() => {
      setOrderId(newOrderId());
      setStage("success");
    }, 1600);
  }, []);

  const restart = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStage("form");
    setMethod("card");
    setOrderId(null);
  }, []);

  return (
    <div
      style={merchTheme}
      className="relative w-full overflow-hidden rounded-[24px] border border-[color-mix(in_srgb,var(--merch-secondary)_30%,transparent)] bg-[var(--merch-neutral)] text-[var(--merch-primary)]"
    >
      {/* Store bar */}
      <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] bg-[color-mix(in_srgb,var(--merch-neutral)_88%,transparent)] px-4 py-3 backdrop-blur sm:px-8">
        <span className="text-[1.05rem] font-bold uppercase tracking-[-0.02em] text-[var(--merch-primary)]">
          BAN<span className="text-[var(--merch-secondary)]"> merch</span>
        </span>
        <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[var(--merch-secondary)]">
          <Lock size={13} strokeWidth={2.5} aria-hidden />
          Secure checkout
        </span>
      </div>

      {stage === "success" ? (
        <SuccessReceipt
          method={method}
          total={totals.total}
          orderId={orderId}
          onRestart={restart}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Payment column */}
          <div className="order-2 flex min-w-0 flex-col gap-5 lg:order-1">
            <h3 className="text-[clamp(1.5rem,4vw,2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--merch-primary)]">
              Payment
            </h3>

            <MethodToggle method={method} onChange={setMethod} />

            <div className="relative">
              {method === "card" ? (
                <CardForm total={totals.total} onPay={pay} />
              ) : (
                <PaypalPanel total={totals.total} onPay={pay} />
              )}

              {/* Processing overlay */}
              {stage === "processing" ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[14px] bg-[color-mix(in_srgb,var(--merch-neutral)_82%,transparent)] backdrop-blur-sm">
                  <Loader2
                    size={30}
                    strokeWidth={2.5}
                    aria-hidden
                    className="animate-spin text-[var(--merch-tertiary)]"
                  />
                  <p
                    aria-live="polite"
                    className="text-[0.85rem] font-semibold uppercase tracking-[0.1em] text-[var(--merch-primary)]"
                  >
                    Processing payment…
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Summary column */}
          <aside className="order-1 min-w-0 rounded-[24px] bg-[var(--merch-surface)] p-4 sm:p-6 lg:order-2">
            <OrderSummary items={ORDER_ITEMS} totals={totals} />
          </aside>
        </div>
      )}
    </div>
  );
}
