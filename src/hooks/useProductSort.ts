import { useState, useMemo } from "react";
import type { Product } from "@/types/product";

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating-desc" | "category-asc";

export const useProductSort = (products: Product[]) => {
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case "price-desc":
        return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      case "rating-desc":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "category-asc":
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedProducts,
  };
};

// Helper function to parse price
function parsePrice(price: number | string): number {
  if (typeof price === "number") return price;
  const parsed = parseFloat(price.toString().replace(/[^\d.,]/g, "").replace(",", "."));
  return isNaN(parsed) ? 0 : parsed;
}