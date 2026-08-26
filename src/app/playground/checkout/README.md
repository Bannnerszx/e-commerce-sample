# Playground — Checkout & Payment Flow

A self-contained, front-end-only **checkout** embedded as a live **playground** in
section `02` of the homepage. It's the natural next step after the BAN Merch
storefront (section `01`): where that playground ends at the cart, this one walks
the full **payment flow** — method choice → card or PayPal → processing → receipt —
entirely as internal React state. No routing, no backend, no real gateway.

- **Rendered at:** [`src/app/Showcase.js`](../../Showcase.js) → `CheckoutPlaygroundSection`
  (`02 · Playground / Checkout & Payment Flow`)
- **Entry component:** [`Checkout.js`](./Checkout.js)
- **Design spec:** [`COMMERCE-DESIGN.md`](../../../../COMMERCE-DESIGN.md) — the same
  "Running Kilometer" palette used by the merch storefront (orange/neutral/monochrome,
  Outfit type, flat, **one accent per screen**).

---

## What it does

One bordered box, an order summary beside a payment panel:

1. **Method toggle** — a segmented control between **Card** and **PayPal**
   ([`MethodToggle.js`](./components/MethodToggle.js)). Selection is monochrome; the
   orange accent is reserved for the pay action only.
2. **Card flow** — a real credit-card form with live formatting (4-4-4-4 / Amex
   4-6-5), brand detection (Visa / Mastercard / Amex / Discover), a Luhn check, and
   expiry/CVC validation ([`CardForm.js`](./components/CardForm.js)). A **Use demo
   card** shortcut autofills a passing `4242…` card.
3. **PayPal flow** — a simulated handoff that reveals an in-box "authorize" consent
   card mimicking the PayPal consent screen, then returns
   ([`PaypalPanel.js`](./components/PaypalPanel.js)).
4. **Processing → Receipt** — both paths converge on a brief processing overlay, then
   a success receipt with a generated order id, method, and amount paid
   ([`SuccessReceipt.js`](./components/SuccessReceipt.js)).

`Checkout.js` owns the flow state: `method` (`card` | `paypal`), `stage`
(`form` | `processing` | `success`), and the generated `orderId`. Totals (subtotal,
free shipping, estimated tax) are derived in [`checkout-data.js`](./checkout-data.js).

---

## Design scoping

Identical approach to the merch playground: the "Running Kilometer" tokens are set as
local CSS variables on the root box (`--merch-primary`, `--merch-secondary`,
`--merch-tertiary`, `--merch-neutral`, `--merch-surface`) plus `font-family:
var(--font-outfit)`, so the surrounding indigo site theme is neither inherited nor
leaked into. Components reference those vars via Tailwind arbitrary values.

- **Flat, no gradients.** Card/PayPal marks are text-based — no image assets.
- **Single accent per screen:** orange (`--merch-tertiary`) appears on exactly one
  action per view — the pay button, the PayPal authorize button, or "Run the flow
  again". The method toggle and secondary links stay monochrome.
- **Accessible:** labelled inputs with inline `role="alert"` errors, a `radiogroup`
  method toggle, `aria-live` on the processing status, and visible focus rings.

---

## Folder structure

```
src/app/playground/checkout/
├── Checkout.js               # Client entry: flow state + scoped theme + layout
├── checkout-data.js          # Order items, totals, card formatting/validation helpers
├── README.md                 # This file
└── components/
    ├── OrderSummary.js       # Line items + subtotal / shipping / tax / total
    ├── MethodToggle.js       # Card ↔ PayPal segmented control
    ├── CardForm.js           # Card fields: formatting, brand detection, validation
    ├── PaypalPanel.js        # Simulated PayPal authorize handoff
    ├── SuccessReceipt.js     # Payment-complete receipt
    └── brand-marks.js        # Text-based PayPal wordmark + card brand chips
```

Reuses [`cn()`](../map/lib/cn.js) and `lucide-react` icons (already project deps).

---

## Editing the order or validation

- **Line items / totals:** edit `ORDER_ITEMS`, `SHIPPING`, and `TAX_RATE` in
  [`checkout-data.js`](./checkout-data.js).
- **Card rules:** `CARD_BRANDS`, `detectBrand`, `formatCardNumber`, `luhnValid`,
  `expiryValid`, and `validateCard` all live in the same file.
- **Demo card:** `DEMO_CARD` — the autofill values behind "Use demo card".

---

## Verify

```bash
npm run build     # compiles; `/` prerenders (playground is a client island)
npm run dev       # then open the homepage, scroll to section 02
```

Expected: an order summary + payment panel render inside the bordered box. The **Card**
tab formats and validates input (try "Use demo card"); the **PayPal** tab opens the
authorize card. Paying either way shows a processing spinner, then the receipt; "Run
the flow again" resets. The surrounding indigo sections are visually unaffected; no
console errors.
