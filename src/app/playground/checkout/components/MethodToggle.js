"use client";

import { cn } from "../../map/lib/cn";
import { CardGlyph, PaypalWordmark } from "./brand-marks";

const METHODS = [
  { key: "card", label: "Card" },
  { key: "paypal", label: "PayPal" },
];

// Segmented control. Selection uses the monochrome primary — the reserved
// orange accent stays on the single pay action, never on navigation.
export function MethodToggle({ method, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Payment method"
      className="grid grid-cols-2 gap-2 rounded-[14px] border border-[color-mix(in_srgb,var(--merch-secondary)_30%,transparent)] bg-[var(--merch-neutral)] p-1"
    >
      {METHODS.map((m) => {
        const active = method === m.key;
        return (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m.key)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[0.85rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]",
              active
                ? "bg-[var(--merch-surface)] text-[var(--merch-primary)] shadow-sm"
                : "text-[var(--merch-secondary)] hover:text-[var(--merch-primary)]"
            )}
          >
            {m.key === "card" ? (
              <>
                <CardGlyph />
                <span>{m.label}</span>
              </>
            ) : (
              <PaypalWordmark className="text-[0.95rem]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
