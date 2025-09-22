import { useState, useMemo } from "react";
import type { Product } from "@/lib/supabase";

export interface ProductFilters {
  priceRange: [number, number];
  minRating: number;
  showNewOnly: boolean;
  showInStock: boolean;
}

export const useProductFilters = (products: Product[]) => {
  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (!products.length) return [0, 1000] as [number, number];
    
    const prices = products
      .map(parsePrice)
      .filter(price => price > 0);
    
    if (!prices.length) return [0, 1000] as [number, number];
    
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] as [number, number];
  }, [products]);

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    priceRange,
    minRating: 0,
    showNewOnly: false,
    showInStock: false,
  }));

  // Update price range when products change
  const currentFilters = useMemo(() => {
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 1000) {
      return { ...filters, priceRange };
    }
    return filters;
  }, [filters, priceRange]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = parsePrice(product.price);
      
      // Price range filter
      if (price < currentFilters.priceRange[0] || price > currentFilters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (currentFilters.minRating > 0 && (!product.rating || product.rating < currentFilters.minRating)) {
        return false;
      }

      // New products filter
      if (currentFilters.showNewOnly && !product.is_new) {
        return false;
      }

      // In stock filter (assuming all products are in stock for now)
      if (currentFilters.showInStock) {
        return true;
      }

      return true;
    });
  }, [products, currentFilters]);

  const hasActiveFilters = useMemo(() => 
    currentFilters.minRating > 0 || 
    currentFilters.showNewOnly || 
    currentFilters.showInStock ||
    currentFilters.priceRange[0] !== priceRange[0] ||
    currentFilters.priceRange[1] !== priceRange[1],
    [currentFilters, priceRange]
  );

  const clearFilters = () => {
    setFilters({
      priceRange,
      minRating: 0,
      showNewOnly: false,
      showInStock: false,
    });
  };

  return {
    filters: currentFilters,
    setFilters,
    priceRange,
    filteredProducts,
    hasActiveFilters,
    clearFilters,
  };
};

// Helper function to parse price
function parsePrice(price: number | string): number {
  if (typeof price === "number") return price;
  const parsed = parseFloat(price.toString().replace(/[^\d.,]/g, "").replace(",", "."));
  return isNaN(parsed) ? 0 : parsed;
}