// Local catalog for the BAN Merch playground. No backend, no assets —
// each product renders a flat monogram tile (see ProductCard / ProductPage).

export const PRODUCTS = [
  {
    id: "heavyweight-tee",
    name: "Heavyweight Box Tee",
    monogram: "BAN",
    price: 48,
    tag: "New drop",
    category: "Tops",
    color: "Washed Black",
    blurb:
      "280gsm carded cotton, boxy cut, dropped shoulder. Screen-printed wordmark that softens with every wash.",
    details: [
      "280gsm heavyweight carded cotton",
      "Boxy fit with dropped shoulders",
      "Water-based screen print",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "logo-hoodie",
    name: "Arc Logo Hoodie",
    monogram: "ARC",
    price: 96,
    tag: "Bestseller",
    category: "Fleece",
    color: "Bone",
    blurb:
      "Brushed-back 450gsm fleece with a double-lined hood and split kangaroo pocket. Runs true to size.",
    details: [
      "450gsm brushed-back fleece",
      "Double-lined hood, flat drawcords",
      "Ribbed cuffs and hem",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "runner-cap",
    name: "Runner 5-Panel Cap",
    monogram: "5P",
    price: 34,
    tag: null,
    category: "Headwear",
    color: "Track Orange",
    blurb:
      "Unstructured 5-panel in coated nylon with a low profile and a webbing strap-back. One size, dialed in.",
    details: [
      "Coated ripstop nylon shell",
      "Low-profile unstructured crown",
      "Adjustable webbing strap-back",
    ],
    sizes: ["OS"],
  },
  {
    id: "field-shorts",
    name: "Field Nylon Shorts",
    monogram: "FLD",
    price: 62,
    tag: null,
    category: "Bottoms",
    color: "Slate",
    blurb:
      "Lightweight ripstop shorts with a zip security pocket and elastic drawcord waist. Built for the long way home.",
    details: [
      "Lightweight ripstop nylon",
      "Zip security pocket",
      "Elastic drawcord waist",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "crew-socks",
    name: "Ribbed Crew Socks (2-Pack)",
    monogram: "2PK",
    price: 22,
    tag: null,
    category: "Accessories",
    color: "Bone / Black",
    blurb:
      "Cushioned combed-cotton crew socks with a jacquard cuff logo. Sold as a two-pack.",
    details: [
      "Combed-cotton blend, cushioned sole",
      "Jacquard-knit cuff logo",
      "Two pairs per pack",
    ],
    sizes: ["OS"],
  },
  {
    id: "tote-bag",
    name: "Canvas Carry Tote",
    monogram: "TOTE",
    price: 28,
    tag: "Low stock",
    category: "Accessories",
    color: "Natural",
    blurb:
      "16oz natural canvas tote with reinforced handles and an internal slip pocket. Carries a week of groceries or none.",
    details: [
      "16oz heavy natural canvas",
      "Reinforced boxed handles",
      "Internal slip pocket",
    ],
    sizes: ["OS"],
  },
];

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}
