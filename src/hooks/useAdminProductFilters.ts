import { useState, useMemo } from "react";
import type { Product } from "@/types/product";
import { useCategoriesQuery } from "./useCategoryQuery";

export interface AdminProductFilters {
  category: string;
  priceRange: [number, number];
  searchTerm: string;
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

export const useAdminProductFilters = (products: Product[]) => {
  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData || [];
  const [filters, setFilters] = useState<AdminProductFilters>({
    category: "Todos",
    priceRange: [0, 1000],
    searchTerm: "",
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
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesDescription = product.description?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

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


      return true;
    });
  }, [products, filters]);

  const resetFilters = () => {
    setFilters({
      category: "Todos",
      priceRange: [0, 1000],
      searchTerm: "",
    });
  };

  return {
    filters,
    setFilters,
    priceRange,
    filteredProducts,
    resetFilters,
    categories,
  };
};