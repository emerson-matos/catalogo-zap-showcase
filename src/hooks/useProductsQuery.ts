import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchProductsFromGoogleSheet } from "@/lib/googleSheets";
import { queryKeys } from "@/lib/queryClient";
import type { Product } from "@/types/product";
import type { FilterOptions } from "@/components/ui/advanced-filters";

export const useProductsQuery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    minRating: 0,
    showNewOnly: false,
    showInStock: false,
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
          .filter((name) => name.length > 0),
      ),
    );

    const withoutTodos = uniqueCategories.filter(
      (name) => name.toLowerCase() !== "todos",
    );

    withoutTodos.sort((a, b) => a.localeCompare(b));
    return ["Todos", ...withoutTodos];
  }, [allProducts]);

  // Memoized price range from all products
  const priceRange = useMemo(() => {
    if (!allProducts.length) return [0, 1000] as [number, number];
    
    const prices = allProducts
      .map((product: Product) => {
        const price = typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.,]/g, '').replace(',', '.'))
          : product.price;
        return isNaN(price) ? 0 : price;
      })
      .filter(price => price > 0);
    
    if (!prices.length) return [0, 1000] as [number, number];
    
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    return [min, max] as [number, number];
  }, [allProducts]);

  // Update filters price range when products change
  const currentFilters = useMemo(() => {
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 1000) {
      return { ...filters, priceRange };
    }
    return filters;
  }, [filters, priceRange]);

  // Memoized filtered products based on search, category, and filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== "Todos") {
      const categoryName = categories.find(
        (cat: string) => cat === selectedCategory,
      );
      filtered = filtered.filter(
        (product: Product) => product.category === categoryName,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply advanced filters
    filtered = filtered.filter((product: Product) => {
      // Price range filter
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.,]/g, '').replace(',', '.'))
        : product.price;
      
      if (isNaN(price) || price < currentFilters.priceRange[0] || price > currentFilters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (currentFilters.minRating > 0 && (!product.rating || product.rating < currentFilters.minRating)) {
        return false;
      }

      // New products filter
      if (currentFilters.showNewOnly && !product.isNew) {
        return false;
      }

      // In stock filter (assuming all products are in stock for now)
      if (currentFilters.showInStock) {
        // This could be enhanced with actual stock data
        return true;
      }

      return true;
    });

    return filtered;
  }, [selectedCategory, allProducts, categories, searchQuery, currentFilters]);

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'string' 
            ? parseFloat(a.price.replace(/[^\d.,]/g, '').replace(',', '.'))
            : a.price;
          const priceB = typeof b.price === 'string' 
            ? parseFloat(b.price.replace(/[^\d.,]/g, '').replace(',', '.'))
            : b.price;
          return (priceA || 0) - (priceB || 0);
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'string' 
            ? parseFloat(a.price.replace(/[^\d.,]/g, '').replace(',', '.'))
            : a.price;
          const priceB = typeof b.price === 'string' 
            ? parseFloat(b.price.replace(/[^\d.,]/g, '').replace(',', '.'))
            : b.price;
          return (priceB || 0) - (priceA || 0);
        });
      case 'rating-desc':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'category-asc':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

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
    filteredProductsCount: filteredProducts.length,

    // Category management
    selectedCategory,
    setSelectedCategory,

    // Search functionality
    searchQuery,
    setSearchQuery,

    // Sort functionality
    sortBy,
    setSortBy,

    // Filter functionality
    filters: currentFilters,
    setFilters,
    priceRange,

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
    hasSearchResults: searchQuery.trim().length > 0,
    hasActiveFilters: 
      currentFilters.minRating > 0 || 
      currentFilters.showNewOnly || 
      currentFilters.showInStock ||
      currentFilters.priceRange[0] !== priceRange[0] ||
      currentFilters.priceRange[1] !== priceRange[1],
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

