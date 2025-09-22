import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { SupabaseService } from "@/lib/supabaseService";
import { queryKeys, queryKeyUtils, type ProductFilters } from "@/lib/queryClient";
import type { Product } from "@/lib/supabase";

// Enhanced products query hook with advanced features
export const useProductsQuery = (filters?: ProductFilters) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const queryClient = useQueryClient();

  // Memoized filters for query key stability
  const stableFilters = useMemo(() => {
    return {
      category: selectedCategory === "Todos" ? undefined : selectedCategory,
      ...filters,
    };
  }, [selectedCategory, filters]);

  // Main products query with enhanced configuration
  const {
    data: allProducts = [],
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
    isStale,
    isPending,
    isPlaceholderData,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: queryKeys.products.supabase(stableFilters),
    queryFn: () => SupabaseService.getProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: (query) => {
      const lastDataUpdate = query.state.dataUpdatedAt;
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      return lastDataUpdate < fiveMinutesAgo;
    },
    placeholderData: (previousData) => previousData,
    select: (data: Product[]) => {
      if (stableFilters.search) {
        const searchLower = stableFilters.search.toLowerCase();
        return data.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower)
        );
      }
      return data;
    },
  });

  // Separate query for categories
  const {
    data: categories = ["Todos"],
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: queryKeys.products.categories.list(),
    queryFn: SupabaseService.getCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    select: (data: string[]) => {
      if (!data || data.length === 0) return ["Todos"];
      return ["Todos", ...data.filter(cat => cat !== "Todos")];
    },
  });

  // Optimistic category switch
  const switchCategory = (newCategory: string) => {
    setSelectedCategory(newCategory);
    
    if (newCategory !== "Todos") {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.categories.byCategory(newCategory),
        queryFn: () => SupabaseService.getProductsByCategory(newCategory),
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") {
      return allProducts;
    }
    return allProducts.filter(
      (product: Product) => product.category === selectedCategory
    );
  }, [selectedCategory, allProducts]);

  // Enhanced error message
  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof Error) {
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return {
          title: "Erro de Conexão",
          message: "Verifique sua conexão com a internet e tente novamente.",
          action: "Tentar Novamente",
          type: "network" as const,
        };
      }
      
      if (error.message.includes("403") || error.message.includes("401")) {
        return {
          title: "Acesso Negado",
          message: "Você não tem permissão para acessar estes dados.",
          action: "Fazer Login",
          type: "auth" as const,
        };
      }
      
      if (error.message.includes("404")) {
        return {
          title: "Dados Não Encontrados",
          message: "Os produtos solicitados não foram encontrados.",
          action: "Atualizar",
          type: "notfound" as const,
        };
      }
      
      if (error.message.includes("5")) {
        return {
          title: "Erro do Servidor",
          message: "Nossos servidores estão temporariamente indisponíveis.",
          action: "Tentar Novamente",
          type: "server" as const,
        };
      }
      
      return {
        title: "Erro Inesperado",
        message: error.message,
        action: "Tentar Novamente",
        type: "unknown" as const,
      };
    }

    return {
      title: "Erro Desconhecido",
      message: "Ocorreu um erro desconhecido ao carregar os produtos.",
      action: "Tentar Novamente",
      type: "unknown" as const,
    };
  }, [error]);

  // Prefetch related data
  useEffect(() => {
    if (!isCategoriesLoading && categories.length <= 1) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.categories.list(),
        queryFn: SupabaseService.getCategories,
      });
    }
  }, [queryClient, isCategoriesLoading, categories.length]);

  return {
    // Core data
    products: filteredProducts,
    allProducts,
    categories,
    totalProducts: allProducts.length,
    filteredCount: filteredProducts.length,

    // Category management with optimistic updates
    selectedCategory,
    setSelectedCategory: switchCategory,

    // Enhanced query states
    isLoading: isLoading || isCategoriesLoading,
    isFetching,
    isError,
    error: errorMessage,
    isStale,
    isPending,
    isPlaceholderData,
    isFetchedAfterMount,

    // Actions with enhanced feedback
    refetch: async () => {
      const result = await refetch();
      if (result.isSuccess) {
        queryKeyUtils.invalidateProductList(queryClient, stableFilters);
      }
      return result;
    },

    // Computed states
    isEmpty: !isLoading && allProducts.length === 0,
    hasProducts: allProducts.length > 0,
    hasFilteredProducts: filteredProducts.length > 0,
    showEmptyState: !isLoading && !isError && filteredProducts.length === 0,

    // Performance indicators
    isDataFresh: !isStale && isFetchedAfterMount,
    lastUpdated: isFetchedAfterMount ? new Date() : null,
  };
};

// Hook for infinite/paginated products (useful for large catalogs)
export const useInfiniteProductsQuery = (filters?: ProductFilters & { pageSize?: number }) => {
  const pageSize = filters?.pageSize || 20;
  
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...queryKeys.products.list(filters), 'infinite', pageSize],
    queryFn: ({ pageParam = 0 }) => 
      SupabaseService.getProductsPaginated({
        ...filters,
        offset: pageParam * pageSize,
        limit: pageSize,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.length === pageSize ? lastPageParam + 1 : undefined;
    },
    maxPages: 10,
  });

  const allProducts = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data]);

  return {
    products: allProducts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    totalLoaded: allProducts.length,
    canLoadMore: hasNextPage && !isFetchingNextPage,
  };
};

// Hook for prefetching products (enhanced with smarter strategies)
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  const prefetchProducts = (filters?: ProductFilters) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.products.supabase(filters),
      queryFn: () => SupabaseService.getProducts(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchCategories = () => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.products.categories.list(),
      queryFn: SupabaseService.getCategories,
      staleTime: 15 * 60 * 1000,
    });
  };

  const prefetchPopularProducts = () => {
    return queryKeyUtils.prefetchPopularProducts(
      queryClient,
      () => SupabaseService.getProducts()
    );
  };

  const prefetchByCategory = (category: string) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.products.categories.byCategory(category),
      queryFn: () => SupabaseService.getProductsByCategory(category),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { 
    prefetchProducts, 
    prefetchCategories, 
    prefetchPopularProducts,
    prefetchByCategory,
  };
};

// Enhanced hook for invalidating and managing products cache
export const useProductsCache = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = (filters?: ProductFilters) => {
    return queryKeyUtils.invalidateProductList(queryClient, filters);
  };

  const invalidateAllProducts = () => {
    return queryKeyUtils.invalidateProductQueries(queryClient);
  };

  const refetchProducts = (filters?: ProductFilters) => {
    return queryClient.refetchQueries({
      queryKey: queryKeys.products.supabase(filters),
    });
  };

  const removeProductFromCache = (productId: string) => {
    return queryKeyUtils.removeProductFromCache(queryClient, productId);
  };

  const getCachedProduct = (productId: string) => {
    return queryKeyUtils.getCachedProduct(queryClient, productId);
  };

  const updateProductInCache = (productId: string, updater: (old: Product) => Product) => {
    return queryKeyUtils.updateProductInCaches(queryClient, productId, updater);
  };

  const optimisticallyUpdateProduct = (productId: string, updates: Partial<Product>) => {
    const previousData = getCachedProduct(productId);
    
    updateProductInCache(productId, (old: Product) => ({
      ...old,
      ...updates,
    }));

    return () => {
      if (previousData) {
        queryKeyUtils.setProductInCache(queryClient, productId, previousData);
      }
    };
  };

  return { 
    invalidateProducts,
    invalidateAllProducts, 
    refetchProducts,
    removeProductFromCache,
    getCachedProduct,
    updateProductInCache,
    optimisticallyUpdateProduct,
  };
};

// Hook for product search with debouncing and caching
export const useProductSearch = (searchTerm: string, debounceMs: number = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const {
    data: searchResults = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.products.search(debouncedSearchTerm),
    queryFn: () => SupabaseService.searchProducts(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    searchResults,
    isLoading: isLoading || (searchTerm !== debouncedSearchTerm),
    isError,
    error,
    isFetching,
    hasSearched: debouncedSearchTerm.length >= 2,
    isEmpty: !isLoading && searchResults.length === 0 && debouncedSearchTerm.length >= 2,
  };
};

// Hook for single product with related data prefetching
export const useProduct = (productId: string) => {
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => SupabaseService.getProductById(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (product?.category) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.categories.byCategory(product.category),
        queryFn: () => SupabaseService.getProductsByCategory(product.category),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [product?.category, queryClient]);

  return {
    product,
    isLoading,
    isError,
    error,
    refetch,
    notFound: !isLoading && !product,
  };
};