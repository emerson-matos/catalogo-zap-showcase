import { useState, useMemo, useCallback } from "react";
import type { Product } from "@/types/product";
import { useDebounce } from "./useDebounce";

export const useProductSearch = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return products;

    const query = debouncedSearchQuery.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }, [products, debouncedSearchQuery]);

  const handleSearchChange = useCallback((newQuery: string) => {
    setSearchQuery(newQuery);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    filteredProducts,
    isSearching: searchQuery !== debouncedSearchQuery,
  };
};

