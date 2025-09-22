import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import { fetchProductsFromGoogleSheet } from "@/lib/googleSheets";
import { queryKeys } from "@/lib/queryClient";
import type { Product } from "@/types/product";

export type SortOption = 'name' | 'price' | 'category' | 'newest' | 'rating';
export type SortDirection = 'asc' | 'desc';

export interface ProductFilters {
  search: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  showNewOnly: boolean;
  sortBy: SortOption;
  sortDirection: SortDirection;
}

export const useProductsQuery = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
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

  // Helper function to parse price
  const parsePrice = (price: number | string): number => {
    if (typeof price === 'number') return price;
    return parseFloat(price.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
  };

  // Helper function to check if product is new (created within last 30 days)
  const isNewProduct = (product: Product): boolean => {
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  };

  // Memoized categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
    return ['Todos', ...uniqueCategories.sort()];
  }, [allProducts]);

  // Memoized filtered and sorted products
  const products = useMemo(() => {
    let result = allProducts;

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category !== 'Todos') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => parsePrice(p.price) >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => parsePrice(p.price) <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      result = result.filter(p => (p.rating || 0) >= filters.minRating!);
    }

    if (filters.showNewOnly) {
      result = result.filter(p => isNewProduct(p));
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = parsePrice(a.price) - parsePrice(b.price);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'newest':
          comparison = new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
          break;
      }

      return filters.sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
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

  // Optimized callbacks
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'Todos',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      showNewOnly: false,
      sortBy: 'name',
      sortDirection: 'asc'
    });
  }, []);

  const setSearch = useCallback((search: string) => {
    updateFilters({ search });
  }, [updateFilters]);

  const setSorting = useCallback((sortBy: SortOption, sortDirection: SortDirection) => {
    updateFilters({ sortBy, sortDirection });
  }, [updateFilters]);

  // Computed values
  const hasActiveFilters = useMemo(() => 
    filters.search !== '' || 
    filters.category !== 'Todos' || 
    filters.minPrice !== undefined || 
    filters.maxPrice !== undefined || 
    filters.minRating !== undefined || 
    filters.showNewOnly
  , [filters]);

  return {
    // Data
    products,
    allProducts,
    categories,
    totalProducts: allProducts.length,
    filteredCount: products.length,

    // Filter management
    filters,
    updateFilters,
    resetFilters,
    setSearch,
    setSorting,

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
    hasActiveFilters,
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

