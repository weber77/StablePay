import type { Product } from "@/lib/products";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export type MarketplaceFilters = {
  search: string;
  category: string | null;
  sort: SortOption;
  priceMin: number;
  priceMax: number;
};

export function filterProducts(
  items: Product[],
  filters: MarketplaceFilters,
): Product[] {
  const q = filters.search.trim().toLowerCase();

  let result = items.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  switch (filters.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return result;
}
