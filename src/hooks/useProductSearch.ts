import { useState, useMemo } from "react";
import type { Product } from "@/types/product";

export const useProductSearch = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts,
  };
};

