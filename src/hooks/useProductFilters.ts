"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/types/product";
import { useCategoriesQuery, useCategoryQuery } from "./useCategoryQuery";

export interface ProductFilters {
  category: string;
  priceRange: [number, number];
  minRating: number;
  showNewOnly: boolean;
}

const parsePrice = (price: number | string): number => {
  if (typeof price === "number") return price;
  const parsed = parseFloat(
    String(price)
      .replace(/[^\d.,]/g, "")
      .replace(",", "."),
  );
  return isNaN(parsed) ? 0 : parsed;
};

export const useProductFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<ProductFilters>({
    category: "Todos",
    priceRange: [0, 1000],
    minRating: 0,
    showNewOnly: false,
  });

  // Get price range from products
  const priceRange = useMemo(() => {
    if (!products.length) return { min: 0, max: 1000 };

    const prices = products.map((product) => parsePrice(product.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (
        filters.category !== "Todos" &&
        product.category_id !== filters.category
      ) {
        return false;
      }

      // Price filter
      const price = parsePrice(product.price);
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (
        filters.minRating > 0 &&
        (!product.rating || product.rating < filters.minRating)
      ) {
        return false;
      }

      // New products filter
      if (filters.showNewOnly && !product.is_new) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  return {
    filters,
    setFilters,
    priceRange,
    filteredProducts,
  };
};
