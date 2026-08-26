"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";

// On mobile the collection reveals one piece at a time; "Load more" adds a
// single card per tap. On larger screens the full grid is shown at once.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function StorefrontHome({ products, onOpenProduct }) {
  const gridRef = useRef(null);
  const isMobile = useIsMobile();
  const [visibleCount, setVisibleCount] = useState(1);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleProducts = isMobile
    ? products.slice(0, visibleCount)
    : products;
  const hasMore = isMobile && visibleCount < products.length;

  return (
    <div className="flex flex-col">
      {/* Hero — monochrome field, one orange action (the drop CTA) */}
      <section className="px-4 pb-8 pt-9 sm:px-8 sm:pt-14">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
          Fall Collection ’26 — Drop 01
        </span>
        <h2 className="mt-3 max-w-[14ch] text-[clamp(2.4rem,8vw,4rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-[var(--merch-primary)]">
          Built to be worn out.
        </h2>
        <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-[1.55] text-[var(--merch-secondary)]">
          Heavyweight basics and field-tested layers from BAN. Small batches,
          honest materials, no restocks.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
          {/* The single reserved accent action for this screen */}
          <button
            type="button"
            onClick={scrollToGrid}
            className="w-full rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)] sm:w-auto"
          >
            Shop the drop ↓
          </button>
          <span className="text-[0.8rem] font-medium text-[var(--merch-secondary)]">
            {products.length} pieces · Free shipping over $75
          </span>
        </div>
      </section>

      {/* Product grid */}
      <section
        ref={gridRef}
        className="border-t border-[color-mix(in_srgb,var(--merch-secondary)_25%,transparent)] px-4 py-8 sm:px-8"
      >
        <div className="mb-5 flex items-baseline justify-between">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
            The collection
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 1)}
              className="w-full rounded-[14px] border border-[color-mix(in_srgb,var(--merch-secondary)_40%,transparent)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-[var(--merch-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--merch-secondary)_12%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
            >
              Load more ({products.length - visibleCount} left)
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
