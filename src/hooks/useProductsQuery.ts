import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchProductsFromGoogleSheet } from "@/lib/googleSheets";
import { queryKeys } from "@/lib/queryClient";
import type { Product } from "@/types/product";

export type SortOption = 'name' | 'price' | 'category' | 'newest' | 'rating';
export type SortDirection = 'asc' | 'desc';

export interface ProductFilters {
  searchTerm: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  showNewOnly: boolean;
  sortBy: SortOption;
  sortDirection: SortDirection;
}

export const useProductsQuery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    category: 'Todos',
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    showNewOnly: false,
    sortBy: 'name',
    sortDirection: 'asc'
  });

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

  // Memoized categories derived from products
  const categories = useMemo(() => {
    if (!allProducts.length) return ["Todos"];

    const uniqueCategories = Array.from(
      new Set(
        allProducts
          .map((item: Product) => String(item.category || "").trim())
          .filter((name: string) => name.length > 0),
      ),
    );

    const withoutTodos = uniqueCategories.filter(
      (name: string) => name.toLowerCase() !== "todos",
    );

    withoutTodos.sort((a: string, b: string) => a.localeCompare(b));
    return ["Todos", ...withoutTodos];
  }, [allProducts]);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== "Todos") {
      filtered = filtered.filter((product: Product) => 
        product.category === filters.category
      );
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((product: Product) => {
        const price = typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.,]/g, '').replace(',', '.'))
          : product.price;
        return price >= filters.minPrice!;
      });
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((product: Product) => {
        const price = typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.,]/g, '').replace(',', '.'))
          : product.price;
        return price <= filters.maxPrice!;
      });
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      filtered = filtered.filter((product: Product) => 
        (product.rating || 0) >= filters.minRating!
      );
    }

    // New products filter
    if (filters.showNewOnly) {
      filtered = filtered.filter((product: Product) => product.isNew);
    }

    // Sorting
    filtered.sort((a: Product, b: Product) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          const priceA = typeof a.price === 'string' 
            ? parseFloat(a.price.replace(/[^\d.,]/g, '').replace(',', '.'))
            : a.price;
          const priceB = typeof b.price === 'string' 
            ? parseFloat(b.price.replace(/[^\d.,]/g, '').replace(',', '.'))
            : b.price;
          comparison = priceA - priceB;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'newest':
          // Assuming newer products have higher IDs or we could add a date field
          comparison = a.id.localeCompare(b.id);
          break;
        default:
          comparison = 0;
      }

      return filters.sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [allProducts, filters]);

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

  // Helper functions for filter management
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev: ProductFilters) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'Todos',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      showNewOnly: false,
      sortBy: 'name',
      sortDirection: 'asc'
    });
  };

  const setSearchTerm = (searchTerm: string) => {
    updateFilters({ searchTerm });
  };

  const setSorting = (sortBy: SortOption, sortDirection: SortDirection) => {
    updateFilters({ sortBy, sortDirection });
  };

  return {
    // Data
    products: filteredProducts,
    allProducts,
    categories,
    totalProducts: allProducts.length,
    filteredProductsCount: filteredProducts.length,

    // Filter management
    filters,
    updateFilters,
    resetFilters,
    setSearchTerm,
    setSorting,

    // Category management (keeping for backward compatibility)
    selectedCategory,
    setSelectedCategory,

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
    hasActiveFilters: filters.searchTerm !== '' || 
                     filters.category !== 'Todos' || 
                     filters.minPrice !== undefined || 
                     filters.maxPrice !== undefined || 
                     filters.minRating !== undefined || 
                     filters.showNewOnly,
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

