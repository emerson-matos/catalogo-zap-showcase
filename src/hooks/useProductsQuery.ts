import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import { SupabaseService } from "@/lib/supabaseService";
import { queryKeys } from "@/lib/queryClient";
import type { Product, ProductFilters, ProductSortOptions } from "@/types/product";

interface UseProductsQueryOptions {
  readonly filters?: ProductFilters;
  readonly sortOptions?: ProductSortOptions;
  readonly enabled?: boolean;
}

interface UseProductsQueryReturn {
  readonly products: readonly Product[];
  readonly allProducts: readonly Product[];
  readonly categories: readonly string[];
  readonly totalProducts: number;
  readonly selectedCategory: string;
  readonly setSelectedCategory: (category: string) => void;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly isError: boolean;
  readonly error: string | null;
  readonly isStale: boolean;
  readonly isEmpty: boolean;
  readonly hasProducts: boolean;
  readonly refetch: () => void;
}

export const useProductsQuery = (options: UseProductsQueryOptions = {}): UseProductsQueryReturn => {
  const { filters, sortOptions, enabled = true } = options;
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
    queryKey: queryKeys.products.supabase(),
    queryFn: SupabaseService.getProducts,
    enabled,
    // Use global defaults from queryClient, but can override specific options here if needed
  });

  // Memoized categories derived from products
  const categories = useMemo(() => {
    if (!allProducts.length) {
      return ["Todos"] as const;
    }

    const uniqueCategories = Array.from(
      new Set(
        allProducts
          .map((item: Product) => String(item.category || "").trim())
          .filter((name) => name.length > 0),
      ),
    );

    const withoutTodos = uniqueCategories.filter(
      (name) => name.toLowerCase() !== "todos",
    );

    withoutTodos.sort((a, b) => a.localeCompare(b));
    return ["Todos", ...withoutTodos] as const;
  }, [allProducts]);

  // Memoized filtered products based on selected category and filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Apply category filter
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(
        (product: Product) => product.category === selectedCategory,
      );
    }

    // Apply additional filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (product: Product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower),
        );
      }

      if (filters.priceRange) {
        filtered = filtered.filter(
          (product: Product) => {
            const price = typeof product.price === 'string' 
              ? parseFloat(product.price.replace(/[^\d,.]/g, '').replace(',', '.'))
              : product.price;
            return price >= (filters.priceRange?.min ?? 0) && price <= (filters.priceRange?.max ?? Infinity);
          },
        );
      }

      if (filters.rating) {
        filtered = filtered.filter(
          (product: Product) => (product.rating ?? 0) >= (filters.rating ?? 0),
        );
      }

      if (filters.isNew !== undefined) {
        filtered = filtered.filter(
          (product: Product) => product.is_new === filters.isNew,
        );
      }
    }

    // Apply sorting
    if (sortOptions) {
      filtered = [...filtered].sort((a, b) => {
        const { field, order } = sortOptions;
        let aValue: unknown;
        let bValue: unknown;

        switch (field) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = typeof a.price === 'string' 
              ? parseFloat(a.price.replace(/[^\d,.]/g, '').replace(',', '.'))
              : a.price;
            bValue = typeof b.price === 'string' 
              ? parseFloat(b.price.replace(/[^\d,.]/g, '').replace(',', '.'))
              : b.price;
            break;
          case 'rating':
            aValue = a.rating ?? 0;
            bValue = b.rating ?? 0;
            break;
          case 'created_at':
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [selectedCategory, allProducts, filters, sortOptions]);

  // Enhanced error message
  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    if (error instanceof Error) {
      // Network errors
      if (error.message.includes("fetch")) {
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      // Supabase specific errors
      if (error.message.includes("403")) {
        return "Acesso negado. Verifique as permissões.";
      }
      if (error.message.includes("404")) {
        return "Recurso não encontrado. Verifique a configuração.";
      }
      return error.message;
    }

    return "Erro desconhecido ao carregar produtos.";
  }, [error]);

  const setSelectedCategoryCallback = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return {
    // Data
    products: filteredProducts,
    allProducts,
    categories,
    totalProducts: allProducts.length,

    // Category management
    selectedCategory,
    setSelectedCategory: setSelectedCategoryCallback,

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

  const prefetchProducts = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.supabase(),
      queryFn: SupabaseService.getProducts,
    });
  }, [queryClient]);

  return { prefetchProducts };
};

// Hook for invalidating and refetching products (useful for admin actions)
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.all,
    });
  }, [queryClient]);

  const refetchProducts = useCallback(() => {
    queryClient.refetchQueries({
      queryKey: queryKeys.products.supabase(),
    });
  }, [queryClient]);

  return { invalidateProducts, refetchProducts };
};

