export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  image: string;
  inStock: boolean;
  link?: string;
  /** Show "from" prefix on price (variant pricing) */
  priceFrom?: boolean;
};

/** Demo use cases — order controls category pill sequence in the marketplace */
export const PRODUCT_CATEGORIES = [
  "Donation",
  "Tips",
  "Digital",
  "Subscription",
  "Physical goods",
  "Services",
  "Tickets",
  "Membership",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/** Public asset at `public/products/{id}.png` */
export function productImagePath(
  id: string,
  ext: "png" | "webp" | "jpeg" = "png",
) {
  return `/products/${id}.${ext}`;
}

type ProductSeed = Omit<Product, "image"> & { image?: string };

const PRODUCT_SEEDS: ProductSeed[] = [
  // Donation — creator & open-source support
  {
    id: "donate-developer",
    name: "Support the developer",
    description:
      "One-time contribution to fund docs, fixes, and weekend OSS releases. Tax receipt not included (demo).",
    price: 0,
    currency: "USD",
    category: "Donation",
    link: "http://localhost:3002/link/g5ea5292",
    inStock: true,
  },
  {
    id: "donate-project",
    name: "Sponsor our open-source SDK",
    description:
      "Help keep the Wakari client libraries free and maintained for the community.",
    price: 0,
    currency: "USD",
    category: "Donation",
    link: "http://localhost:3002/link/jq82tptb",
    inStock: true,
  },
  {
    id: "donate-cause",
    name: "Climate tech grant pool",
    description:
      "Pooled donations routed to vetted carbon-removal pilots (demo allocation).",
    price: 0,
    currency: "USD",
    category: "Donation",
    link: "http://localhost:3002/link/x9js1n6b",
    inStock: true,
  },

  // Tips — micro-payments & creator economy
  {
    id: "tip-coffee",
    name: "Buy me a coffee",
    description:
      "Quick thank-you tip after a helpful stream, post, or office hours session.",
    price: 0,
    currency: "USD",
    category: "Tips",
    link: "http://localhost:3002/link/syqyjdh4",
    inStock: true,
  },
  {
    id: "tip-shoutout",
    name: "Live stream shoutout",
    description:
      "Your name read on stream plus a pinned thank-you in chat (demo perk).",
    price: 5,
    currency: "USD",
    category: "Tips",
    link: "http://localhost:3002/link/ihseufe4",
    inStock: true,
  },

  // Subscription — recurring SaaS
  {
    id: "sub-starter",
    name: "Merchant Starter — monthly",
    description:
      "Up to 500 checkout sessions / month, email receipts, and sandbox + production keys.",
    price: 29,
    currency: "USD",
    link: "http://localhost:3002/link/axmrxncw",
    category: "Subscription",
    inStock: true,
  },

  // Physical goods — classic e-commerce
  {
    id: "physical-sweat",
    name: "Trail sweatshirt",
    description:
      "Midweight fleece, unisex fit. Ships in 3–5 business days (demo).",
    price: 68,
    currency: "USD",
    category: "Physical goods",
    inStock: true,
  },
  {
    id: "physical-tote",
    name: "Canvas tote",
    description:
      "Reinforced straps with embroidered STABLE-PAY mark. Natural color.",
    price: 28,
    currency: "USD",
    category: "Physical goods",
    inStock: true,
  },
  {
    id: "physical-mug",
    name: "Ceramic camp mug",
    description: "12 oz, dishwasher safe. Matte glaze — limited run.",
    price: 22,
    currency: "USD",
    category: "Physical goods",
    inStock: false,
  },

  // Services — professional & gig economy
  {
    id: "service-review",
    name: "1-hour integration review",
    description:
      "Video call with a solutions engineer to audit your checkout + webhook setup.",
    price: 150,
    currency: "USD",
    category: "Services",
    inStock: true,
  },
  {
    id: "service-onboarding",
    name: "Merchant onboarding package",
    description:
      "KYC assist, test transactions, and go-live checklist for your first production store.",
    price: 499,
    currency: "USD",
    category: "Services",
    inStock: true,
    priceFrom: true,
  },

  // Tickets — events & access
  {
    id: "ticket-webinar",
    name: "STABLE-PAY builder webinar — seat",
    description:
      "Live walkthrough of hosted checkout and settlement. Recording included for 30 days.",
    price: 35,
    currency: "USD",
    category: "Tickets",
    inStock: true,
  },
  {
    id: "ticket-conference",
    name: "Fintech builders day — pass",
    description:
      "Full-day access: keynotes, workshops, and partner expo (demo event).",
    price: 199,
    currency: "USD",
    category: "Tickets",
    inStock: true,
    priceFrom: true,
  },

  // Membership — communities & clubs
  {
    id: "member-community",
    name: "Builders Circle — annual",
    description:
      "Private Slack, office hours, and early access to API previews. Billed once per year.",
    price: 120,
    currency: "USD",
    category: "Membership",
    inStock: true,
  },
  {
    id: "member-pro",
    name: "Merchant Pro lounge",
    description:
      "Monthly membership: compliance templates, rate benchmarks, and partner intros.",
    price: 39,
    currency: "USD",
    category: "Membership",
    inStock: true,
  },
];

export const PRODUCTS: Product[] = PRODUCT_SEEDS.map((p) => ({
  ...p,
  image: p.image ?? productImagePath(p.id, "jpeg"),
}));

const PRODUCT_EMOJI: Record<string, string> = {
  "donate-developer": "💝",
  "donate-project": "🌱",
  "donate-cause": "🌍",
  "tip-coffee": "☕",
  "tip-shoutout": "📣",
  "digital-ui-kit": "🎨",
  "digital-api-credits": "⚡",
  "digital-ebook": "📘",
  "sub-starter": "🔄",
  "sub-growth": "📈",
  "physical-sweat": "🧥",
  "physical-tote": "🛍️",
  "physical-mug": "☕",
  "service-review": "🛠️",
  "service-onboarding": "🚀",
  "ticket-webinar": "🎟️",
  "ticket-conference": "🏛️",
  "member-community": "👥",
  "member-pro": "⭐",
};

export function getProductEmoji(id: string): string {
  return PRODUCT_EMOJI[id] ?? "📦";
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCategories(items: Product[] = PRODUCTS): ProductCategory[] {
  const present = new Set(items.map((p) => p.category));
  return PRODUCT_CATEGORIES.filter((c) => present.has(c));
}

export function getPriceBounds(items: Product[] = PRODUCTS) {
  const prices = items.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
