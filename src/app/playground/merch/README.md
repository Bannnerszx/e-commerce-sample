# Playground — BAN Merch Storefront

A self-contained, front-end-only **merch storefront** embedded as a live **playground**
in section `01` of the homepage. No routing, no backend — the whole browse → product →
cart flow runs inside one bordered box as internal React state.

- **Rendered at:** [`src/app/Showcase.js`](../../Showcase.js) → `MerchPlaygroundSection`
  (`01 · Playground / BAN Merch Storefront`)
- **Entry component:** [`BanMerch.js`](./BanMerch.js)
- **Design spec:** [`COMMERCE-DESIGN.md`](../../../../COMMERCE-DESIGN.md) — the "Running
  Kilometer" palette (orange/neutral/monochrome, Outfit type, flat, one accent per screen).

---

## What it does

Three internal views/states, all inside the embed box:

1. **Storefront home** — brand hero + a 4–6 item product grid ([`StorefrontHome.js`](./components/StorefrontHome.js), [`ProductCard.js`](./components/ProductCard.js)).
2. **Product page** — image tile, price, size picker, quantity stepper, Add to Cart ([`ProductPage.js`](./components/ProductPage.js)).
3. **Cart / finish modal** — an accessible dialog that confirms the add, shows the running
   bag + subtotal, and (on Checkout) becomes the "that's the playground" finish notification
   ([`CartModal.js`](./components/CartModal.js)).

`BanMerch.js` owns all state: `view`, `activeProductId`, `cart`, and the `modal`
(`{ open, stage, item }`). It derives `cartCount` / `subtotal` from the cart.

---

## Design scoping

The surrounding site uses the indigo "Ubuntu" theme (`globals.css` / `DESIGN.md`). This
playground follows a **different** spec (`COMMERCE-DESIGN.md`), so its tokens are set as
local CSS variables on the root box in `BanMerch.js` (`--merch-primary`, `--merch-secondary`,
`--merch-tertiary`, `--merch-neutral`, `--merch-surface`) plus `font-family: var(--font-outfit)`.
Components reference those vars via Tailwind arbitrary values (e.g. `bg-[var(--merch-neutral)]`),
so the theme neither inherits from nor leaks into the rest of the page.

- **Font:** Outfit, loaded in [`layout.js`](../../layout.js) as `--font-outfit`.
- **Flat, no gradients.** Product imagery is a flat neutral tile with a bold monogram — no assets.
- **Single accent per screen:** the orange (`--merch-tertiary`) appears on exactly one action
  per view — home CTA, product Add-to-Cart, modal primary button.

---

## Folder structure

```
src/app/playground/merch/
├── BanMerch.js               # Client entry: state + scoped theme + layout box
├── merch-data.js             # PRODUCTS catalog + getProduct / formatPrice helpers
├── README.md                 # This file
└── components/
    ├── StorefrontHome.js     # Hero + product grid
    ├── ProductCard.js        # Grid tile → opens product view
    ├── ProductPage.js        # Detail: size picker, qty, add to cart
    └── CartModal.js          # Add-to-cart confirmation + finish notification dialog
```

Reuses [`cn()`](../map/lib/cn.js) and `lucide-react` icons (already project deps).

---

## Adding / editing products

Edit [`merch-data.js`](./merch-data.js). Each entry:

```js
{
  id: "heavyweight-tee",     // unique
  name: "Heavyweight Box Tee",
  monogram: "BAN",           // shown on the flat image tile
  price: 48,                 // number; formatPrice() renders "$48.00"
  tag: "New drop",           // or null — dark chip on the card
  category: "Tops",
  color: "Washed Black",
  blurb: "…",                // product-page description
  details: ["…", "…"],       // bullet list on the product page
  sizes: ["S", "M", "L", "XL"], // ["OS"] for one-size items
}
```

---

## Verify

```bash
npm run build     # compiles; `/` prerenders (playground is a client island)
npm run dev       # then open the homepage, scroll to section 01
```

Expected: BAN merch hero + product grid render inside the bordered box; clicking a product
opens its page; picking a size + quantity and Add to Cart opens the modal (Esc / backdrop /
Keep shopping close it; Checkout shows the finish note); the bag count persists; the
surrounding indigo sections are visually unaffected; no console errors.
