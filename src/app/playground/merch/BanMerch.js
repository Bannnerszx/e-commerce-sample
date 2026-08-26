"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { PRODUCTS, getProduct } from "./merch-data";
import { StorefrontHome } from "./components/StorefrontHome";
import { ProductPage } from "./components/ProductPage";
import { CartModal } from "./components/CartModal";

// Local design tokens from COMMERCE-DESIGN.md ("Running Kilometer"), scoped to
// this playground so the surrounding indigo site theme is neither inherited
// nor leaked into.
const merchTheme = {
  "--merch-primary": "#151818",
  "--merch-secondary": "#6A7272",
  "--merch-tertiary": "#FF5E1A",
  "--merch-neutral": "#F4F5F2",
  "--merch-surface": "#FFFFFF",
  fontFamily: "var(--font-outfit), system-ui, sans-serif",
};

export default function BanMerch() {
  const [view, setView] = useState("home"); // "home" | "product"
  const [activeProductId, setActiveProductId] = useState(null);
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState({ open: false, stage: "added", item: null });
  const rootRef = useRef(null);

  const activeProduct = getProduct(activeProductId);

  // Bring the playground box into view so opening a product focuses attention
  // on the storefront rather than leaving it half-scrolled on the page.
  const focusPlayground = useCallback(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.qty, 0),
    [cart]
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.qty, 0),
    [cart]
  );

  const openProduct = useCallback(
    (id) => {
      setActiveProductId(id);
      setView("product");
      focusPlayground();
    },
    [focusPlayground]
  );

  const backToHome = useCallback(() => setView("home"), []);

  const addToCart = useCallback((product, size, qty) => {
    setCart((prev) => [
      ...prev,
      { id: product.id, name: product.name, price: product.price, size, qty },
    ]);
    setModal({ open: true, stage: "added", item: { product, size, qty } });
  }, []);

  const closeModal = useCallback(
    () => setModal((m) => ({ ...m, open: false })),
    []
  );

  const keepShopping = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
    setView("home");
  }, []);

  const checkout = useCallback(
    () => setModal((m) => ({ ...m, stage: "done" })),
    []
  );

  return (
    <div
      ref={rootRef}
      style={{ ...merchTheme, scrollMarginTop: "80px" }}
      className="relative w-full overflow-hidden rounded-[24px] border border-[color-mix(in_srgb,var(--merch-secondary)_30%,transparent)] bg-[var(--merch-neutral)] text-[var(--merch-primary)]"
    >
      {/* Store bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] bg-[color-mix(in_srgb,var(--merch-neutral)_88%,transparent)] px-4 py-3 backdrop-blur sm:px-8">
        <button
          type="button"
          onClick={backToHome}
          className="text-[1.05rem] font-bold uppercase tracking-[-0.02em] text-[var(--merch-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
        >
          BAN<span className="text-[var(--merch-secondary)]"> merch</span>
        </button>

        <div className="flex items-center gap-2 text-[var(--merch-primary)]">
          <ShoppingBag size={18} strokeWidth={2.25} aria-hidden />
          <span
            aria-live="polite"
            className="text-[0.85rem] font-semibold tabular-nums"
          >
            {cartCount}
          </span>
          <span className="sr-only">items in bag</span>
        </div>
      </div>

      {view === "product" && activeProduct ? (
        <ProductPage
          product={activeProduct}
          onBack={backToHome}
          onAddToCart={addToCart}
        />
      ) : (
        <StorefrontHome products={PRODUCTS} onOpenProduct={openProduct} />
      )}

      <CartModal
        open={modal.open}
        stage={modal.stage}
        item={modal.item}
        cartCount={cartCount}
        subtotal={subtotal}
        onClose={closeModal}
        onKeepShopping={keepShopping}
        onCheckout={checkout}
      />
    </div>
  );
}
