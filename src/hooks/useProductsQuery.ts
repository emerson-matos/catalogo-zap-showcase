import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchProductsFromGoogleSheet } from "@/lib/googleSheets";
import { queryKeys } from "@/lib/queryClient";
import { useProductSearch } from "./useProductSearch";
import { useProductSort } from "./useProductSort";
import { useProductFilters } from "./useProductFilters";
import type { Product } from "@/types/product";

export const useProductsQuery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Main products query with TanStack Query
  const {
    data: allProducts = [],
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
    isStale,
  } = useQuery({
    queryKey: queryKeys.products.sheets(),
    queryFn: fetchProductsFromGoogleSheet,
    // Use global defaults from queryClient, but can override specific options here if needed
  });

  // Get categories from products
  const categories = useMemo(() => {
    if (!allProducts.length) return ["Todos"];

    const uniqueCategories = Array.from(
      new Set(allProducts.map(product => product.category).filter(Boolean))
    );

    return ["Todos", ...uniqueCategories.sort()];
  }, [allProducts]);

  // Filter products by category
  const categoryFilteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") return allProducts;
    return allProducts.filter(product => product.category === selectedCategory);
  }, [allProducts, selectedCategory]);

  // Apply search, filters, and sorting
  const { searchQuery, setSearchQuery, filteredProducts: searchFilteredProducts, hasSearch } = 
    useProductSearch(categoryFilteredProducts);
  
  const { filters, setFilters, priceRange, filteredProducts: advancedFilteredProducts, hasActiveFilters, clearFilters } = 
    useProductFilters(searchFilteredProducts);
  
  const { sortBy, setSortBy, sortedProducts } = 
    useProductSort(advancedFilteredProducts);

  // Enhanced error message
  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof Error) {
      // Network errors
      if (error.message.includes("fetch")) {
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      // Google Sheets specific errors
      if (error.message.includes("403")) {
        return "Acesso negado. Verifique as permissões da planilha.";
      }
      if (error.message.includes("404")) {
        return "Planilha não encontrada. Verifique a configuração.";
      }
      return error.message;
    }

    return "Erro desconhecido ao carregar produtos.";
  }, [error]);

  return {
    // Data
    products: sortedProducts,
    allProducts,
    categories,
    totalProducts: allProducts.length,
    filteredProductsCount: sortedProducts.length,

    // Category management
    selectedCategory,
    setSelectedCategory,

    // Search functionality
    searchQuery,
    setSearchQuery,
    hasSearch,

    // Sort functionality
    sortBy,
    setSortBy,

    // Filter functionality
    filters,
    setFilters,
    priceRange,
    hasActiveFilters,
    clearFilters,

    // Query states
    isLoading,
    isFetching,
    isError,
    error: errorMessage,
    isStale,

    // Actions
    refetch,

    // Computed states
    isEmpty: !isLoading && allProducts.length === 0,
    hasProducts: allProducts.length > 0,
  };
};

// Hook for prefetching products (useful for critical pages)
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  const prefetchProducts = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.sheets(),
      queryFn: fetchProductsFromGoogleSheet,
    });
  };

  return { prefetchProducts };
};

// Hook for invalidating and refetching products (useful for admin actions)
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.all,
    });
  };

  const refetchProducts = () => {
    queryClient.refetchQueries({
      queryKey: queryKeys.products.sheets(),
    });
  };

  return { invalidateProducts, refetchProducts };
};

