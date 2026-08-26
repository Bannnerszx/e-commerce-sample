"use client";

import { CreditCard } from "lucide-react";

// Text-based brand marks so the playground needs no image assets. Flat, on
// purpose (COMMERCE-DESIGN.md forbids gradients). Colors are intentionally
// muted to secondary tones except PayPal, which keeps a recognizable two-tone
// wordmark since it names an action.

export function PaypalWordmark({ className = "" }) {
  return (
    <span
      className={`select-none font-bold italic tracking-[-0.02em] ${className}`}
      aria-label="PayPal"
    >
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#0070E0]">Pal</span>
    </span>
  );
}

// A tiny stack of the accepted-card chips shown next to the Card option. On the
// narrowest screens the AMEX chip is dropped so the typed number never slides
// under the strip (it re-appears once the active brand is amex, so the match is
// never hidden).
export function CardBrandRow({ activeKey }) {
  const brands = ["visa", "mastercard", "amex"];
  const labels = { visa: "VISA", mastercard: "MC", amex: "AMEX" };
  return (
    <span className="flex items-center gap-1">
      {brands.map((key) => (
        <span
          key={key}
          className={[
            "rounded-[4px] border px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.08em] tabular-nums transition-colors",
            key === "amex" && activeKey !== "amex" ? "hidden min-[360px]:inline" : "",
            activeKey === key
              ? "border-[var(--merch-primary)] bg-[var(--merch-primary)] text-white"
              : "border-[color-mix(in_srgb,var(--merch-secondary)_40%,transparent)] text-[var(--merch-secondary)]",
          ].join(" ")}
        >
          {labels[key]}
        </span>
      ))}
    </span>
  );
}

export function CardGlyph(props) {
  return <CreditCard size={18} strokeWidth={2.25} aria-hidden {...props} />;
}
