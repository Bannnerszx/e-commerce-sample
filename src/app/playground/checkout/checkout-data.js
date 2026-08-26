// Local order + payment helpers for the Checkout playground. No backend, no
// real gateway — the whole flow is simulated in the browser. The line items
// echo a few BAN Merch pieces so the checkout reads as a continuation of the
// storefront playground above it.

export const ORDER_ITEMS = [
  { id: "heavyweight-tee", name: "Heavyweight Box Tee", monogram: "BAN", size: "L", qty: 1, price: 48 },
  { id: "runner-cap", name: "Runner 5-Panel Cap", monogram: "5P", size: "OS", qty: 1, price: 34 },
  { id: "crew-socks", name: "Ribbed Crew Socks (2-Pack)", monogram: "2PK", size: "OS", qty: 2, price: 22 },
];

export const SHIPPING = 0; // Free shipping over $75 (per the storefront hero)
export const TAX_RATE = 0.0725;

export function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

export function getTotals(items = ORDER_ITEMS) {
  const subtotal = items.reduce((sum, l) => sum + l.price * l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + SHIPPING + tax;
  return { subtotal, shipping: SHIPPING, tax, total };
}

/* ---------------------------------------------------------------------------
 * Card helpers — formatting, brand detection, and a Luhn check. All purely
 * client-side; nothing here talks to a network.
 * ------------------------------------------------------------------------- */

export const CARD_BRANDS = {
  visa: { label: "Visa", pattern: /^4/, lengths: [16], cvcLength: 3 },
  mastercard: { label: "Mastercard", pattern: /^(5[1-5]|2[2-7])/, lengths: [16], cvcLength: 3 },
  amex: { label: "Amex", pattern: /^3[47]/, lengths: [15], cvcLength: 4 },
  discover: { label: "Discover", pattern: /^6(?:011|5)/, lengths: [16], cvcLength: 3 },
};

export function detectBrand(number) {
  const digits = number.replace(/\D/g, "");
  for (const [key, brand] of Object.entries(CARD_BRANDS)) {
    if (brand.pattern.test(digits)) return { key, ...brand };
  }
  return null;
}

// Group into 4s, or 4-6-5 for Amex. Caps length to the brand max (or 16/19).
export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const maxLen = brand ? Math.max(...brand.lengths) : 19;
  const trimmed = digits.slice(0, maxLen);

  if (brand?.key === "amex") {
    return trimmed
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      )
      .trim();
  }
  return trimmed.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function luhnValid(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export function expiryValid(value) {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const end = new Date(year, month, 1); // first of the month AFTER expiry
  return end > now;
}

// Validate the whole card form, returning a field → message map (empty = valid).
export function validateCard({ number, name, expiry, cvc }) {
  const errors = {};
  const brand = detectBrand(number);
  const digits = number.replace(/\D/g, "");

  if (!digits) errors.number = "Enter your card number.";
  else if (brand && !brand.lengths.includes(digits.length))
    errors.number = "Check the card number length.";
  else if (!luhnValid(number)) errors.number = "That card number looks invalid.";

  if (!name.trim()) errors.name = "Enter the name on the card.";

  if (!expiry) errors.expiry = "Enter the expiry date.";
  else if (!expiryValid(expiry)) errors.expiry = "Enter a valid future date.";

  const cvcLen = brand?.cvcLength ?? 3;
  if (!cvc) errors.cvc = "Enter the security code.";
  else if (!new RegExp(`^\\d{${cvcLen}}$`).test(cvc))
    errors.cvc = `${cvcLen} digits.`;

  return errors;
}

// A demo card users can autofill to walk the happy path without typing.
export const DEMO_CARD = {
  number: "4242 4242 4242 4242",
  name: "Alex Runner",
  expiry: "04/29",
  cvc: "123",
};
