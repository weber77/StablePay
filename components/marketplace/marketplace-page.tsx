"use client";

import { useMemo, useState } from "react";
import { PackageOpen, Search, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { FloatingCartButton } from "@/components/marketplace/floating-cart-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart, useCartCount } from "@/lib/cart-context";
import {
  filterProducts,
  type MarketplaceFilters,
  type SortOption,
} from "@/lib/marketplace-filters";
import {
  getCategories,
  getPriceBounds,
  PRODUCTS,
} from "@/lib/products";
import { cn } from "@/lib/utils";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "name-asc": "Name: A–Z",
  "name-desc": "Name: Z–A",
};

const bounds = getPriceBounds();
const categories = getCategories();

export function MarketplacePage() {
  const { lines, add } = useCart();
  const cartCount = useCartCount(lines);
  const cartIds = useMemo(
    () => new Set(lines.map((l) => l.product.id)),
    [lines],
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("featured");
  const [priceMin, setPriceMin] = useState(bounds.min);
  const [priceMax, setPriceMax] = useState(bounds.max);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const filters: MarketplaceFilters = {
    search,
    category,
    sort,
    priceMin,
    priceMax,
  };

  const filtered = useMemo(
    () => filterProducts(PRODUCTS, filters),
    [search, category, sort, priceMin, priceMax],
  );

  function clearFilters() {
    setSearch("");
    setCategory(null);
    setSort("featured");
    setPriceMin(bounds.min);
    setPriceMax(bounds.max);
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== null ||
    sort !== "featured" ||
    priceMin > bounds.min ||
    priceMax < bounds.max;

  return (
    <div className="animated-bg relative min-h-screen flex-1">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 left-1/4 size-64 rounded-full bg-[hsl(var(--fintech))]/15 blur-3xl" />
        <div className="absolute -top-16 right-1/4 size-56 rounded-full bg-[hsl(var(--tech))]/12 blur-3xl" />
      </div>

      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[hsl(var(--fintech))]/80">
            WAKAPAY marketplace
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Shop with{" "}
            <span className="gradient-text">crypto-native</span> checkout
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            One catalog, many checkout patterns — donations, tips, digital
            goods, subscriptions, physical retail, services, tickets, and
            memberships. Filter by use case, then pay with WAKAPAY.
          </p>
        </div>
      </section>

      <section className="relative pb-6">
        <div className="container mx-auto space-y-4 px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-md pl-9"
                aria-label="Search products"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={sort}
                onValueChange={(v) => setSort(v as SortOption)}
              >
                <SelectTrigger className="min-w-[180px] rounded-md">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {SORT_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPriceFilter((v) => !v)}
                className="rounded-md"
              >
                <SlidersHorizontal className="size-4" />
                Price
              </Button>
            </div>
          </div>

          {showPriceFilter && (
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                <span>Price range</span>
                <span className="text-muted-foreground tabular-nums">
                  USD {priceMin.toFixed(0)} – {priceMax.toFixed(0)}
                </span>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs text-muted-foreground">
                  Min
                  <input
                    type="range"
                    min={bounds.min}
                    max={bounds.max}
                    step={1}
                    value={priceMin}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPriceMin(Math.min(v, priceMax));
                    }}
                    className="w-full accent-[hsl(var(--fintech))]"
                  />
                </label>
                <label className="space-y-1 text-xs text-muted-foreground">
                  Max
                  <input
                    type="range"
                    min={bounds.min}
                    max={bounds.max}
                    step={1}
                    value={priceMax}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPriceMax(Math.max(v, priceMin));
                    }}
                    className="w-full accent-[hsl(var(--tech))]"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === null
                  ? "border-[hsl(var(--fintech))]/30 bg-[hsl(var(--fintech))]/10 text-[hsl(var(--fintech))]"
                  : "border-border bg-transparent text-muted-foreground hover:border-[hsl(var(--fintech))]/30 hover:text-[hsl(var(--fintech))]",
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  category === cat
                    ? "border-[hsl(var(--fintech))]/30 bg-[hsl(var(--fintech))]/10 text-[hsl(var(--fintech))]"
                    : "border-border bg-transparent text-muted-foreground hover:border-[hsl(var(--fintech))]/30 hover:text-[hsl(var(--fintech))]",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
            {hasActiveFilters ? " (filtered)" : ""}
          </p>
        </div>
      </section>

      <section className="relative py-6 pb-24 md:py-8 md:pb-28">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div
              className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border/60 bg-muted/30 px-6 py-16 text-center transition-opacity"
              key="empty"
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <PackageOpen className="size-8" />
              </div>
              <p className="font-semibold text-foreground">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting search, category, or price filters.
              </p>
              <Button
                type="button"
                variant="ghost"
                className="mt-6 hover:text-[hsl(var(--fintech))]"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div
              className="mx-auto grid max-w-7xl grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
              key={`grid-${filtered.map((p) => p.id).join(",")}`}
            >
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inCart={cartIds.has(product.id)}
                  onAdd={() => {
                    if (!product.inStock) return;
                    add(product.id, 1);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <FloatingCartButton
        count={cartCount}
        onClick={() => setCartOpen(true)}
      />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
