"use client";

import { useEffect, useRef } from "react";
import { Check, X, ShoppingBag } from "lucide-react";
import { formatPrice } from "../merch-data";

export function CartModal({
  open,
  stage,
  item,
  cartCount,
  subtotal,
  onClose,
  onKeepShopping,
  onCheckout,
}) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  // Focus management: move focus into the dialog on open, restore on close,
  // trap Tab within the panel, and close on Escape.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll(
              'button, [href], input, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.disabled)
        : [];

    focusables()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [open, stage, onClose]);

  if (!open) return null;

  const isDone = stage === "done";

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--merch-primary)_55%,transparent)]"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="merch-modal-title"
        className="relative z-10 m-4 w-full max-w-[26rem] rounded-[24px] bg-[var(--merch-surface)] p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--merch-secondary)] transition-colors hover:bg-[var(--merch-neutral)] hover:text-[var(--merch-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
        >
          <X size={18} strokeWidth={2.5} aria-hidden />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--merch-neutral)] text-[var(--merch-primary)]">
          {isDone ? (
            <ShoppingBag size={18} strokeWidth={2.5} aria-hidden />
          ) : (
            <Check size={18} strokeWidth={3} aria-hidden />
          )}
        </div>

        <h3
          id="merch-modal-title"
          className="mt-4 text-[1.35rem] font-bold tracking-[-0.02em] text-[var(--merch-primary)]"
        >
          {isDone ? "That’s the playground." : "Added to cart"}
        </h3>

        {isDone ? (
          <p className="mt-2 text-[0.9rem] leading-[1.55] text-[var(--merch-secondary)]">
            This is a front-end playground — there’s no real checkout. You just
            walked the full flow: browse → product → cart. Your bag has{" "}
            <strong className="font-semibold text-[var(--merch-primary)]">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </strong>{" "}
            ({formatPrice(subtotal)}).
          </p>
        ) : (
          <>
            {item ? (
              <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-[var(--merch-neutral)] p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--merch-surface)] text-[0.8rem] font-bold uppercase tracking-[-0.02em] text-[var(--merch-primary)]">
                  {item.product.monogram}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.9rem] font-semibold text-[var(--merch-primary)]">
                    {item.product.name}
                  </p>
                  <p className="text-[0.78rem] text-[var(--merch-secondary)]">
                    Size {item.size} · Qty {item.qty}
                  </p>
                </div>
                <span className="shrink-0 text-[0.9rem] font-bold text-[var(--merch-primary)]">
                  {formatPrice(item.product.price * item.qty)}
                </span>
              </div>
            ) : null}

            <div className="mt-4 flex items-center justify-between border-t border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] pt-4">
              <span className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
                Bag · {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
              <span className="text-[1.05rem] font-bold text-[var(--merch-primary)]">
                {formatPrice(subtotal)}
              </span>
            </div>
          </>
        )}

        {/* Actions — single reserved accent per view */}
        <div className="mt-6 flex flex-col gap-2">
          {isDone ? (
            <button
              type="button"
              onClick={onKeepShopping}
              className="rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
            >
              Back to the shop
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onCheckout}
                className="rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={onKeepShopping}
                className="rounded-[14px] border border-[color-mix(in_srgb,var(--merch-secondary)_45%,transparent)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-[var(--merch-primary)] transition-colors hover:bg-[var(--merch-neutral)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
              >
                Keep shopping
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
