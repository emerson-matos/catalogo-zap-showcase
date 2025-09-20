import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchProductsFromGoogleSheet } from "@/lib/googleSheets";
import { queryKeys } from "@/lib/queryClient";
import type { Product } from "@/types/product";
import type { FilterOptions } from "@/components/ui/filter-panel";

export const useProductsQuery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("name-asc");
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

  // Helper function to parse price
  const parsePrice = (price: number | string): number => {
    if (typeof price === 'number') return price;
    const parsed = parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Memoized filtered and searched products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Category filter
    if (selectedCategory !== "Todos") {
      const categoryName = categories.find(
        (cat: string) => cat === selectedCategory,
      );
      filtered = filtered.filter(
        (product: Product) => product.category === categoryName,
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    filtered = filtered.filter((product: Product) => {
      const price = parsePrice(product.price);
      
      // Price range filter
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && (!product.rating || product.rating < filters.minRating)) {
        return false;
      }

      // New products filter
      if (filters.showNewOnly && !product.isNew) {
        return false;
      }

      // In stock filter (assuming all products are in stock for now)
      // This can be extended when stock information is available
      if (filters.showInStock) {
        // For now, we'll assume all products are in stock
        // You can add a stock field to the Product type later
        return true;
      }

      return true;
    });

    return filtered;
  }, [selectedCategory, allProducts, categories, searchQuery, filters]);

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    const [field, direction] = sortOption.split('-') as [string, 'asc' | 'desc'];

    sorted.sort((a: Product, b: Product) => {
      let comparison = 0;

      switch (field) {
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
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          comparison = ratingA - ratingB;
          break;
        default:
          comparison = 0;
      }

      return direction === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }, [filteredProducts, sortOption]);

  // Memoized price range for filters
  const priceRange = useMemo(() => {
    if (!allProducts.length) return { min: 0, max: 1000 };
    
    const prices = allProducts.map(product => parsePrice(product.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [allProducts]);

  // Initialize filters with dynamic price range
  const initializedFilters = useMemo(() => {
    if (priceRange.min !== filters.priceRange[0] || priceRange.max !== filters.priceRange[1]) {
      return {
        ...filters,
        priceRange: [priceRange.min, priceRange.max],
      };
    }
    return filters;
  }, [filters, priceRange]);

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
    filteredCount: sortedProducts.length,

    // Category management
    selectedCategory,
    setSelectedCategory,

    // Search functionality
    searchQuery,
    setSearchQuery,

    // Sort functionality
    sortOption,
    setSortOption,

    // Filter functionality
    filters: initializedFilters,
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
    hasFilteredResults: sortedProducts.length > 0,
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

