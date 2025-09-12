import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchProductsFromGoogleSheet } from '@/lib/googleSheets';
import { queryKeys } from '@/lib/queryClient';
import type { Product } from '@/types/product';

export const useProductsQuery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

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
    if (!allProducts.length) return ["todos"];
    
    const uniqueCategories = Array.from(
      new Set(
        allProducts
          .map((item: Product) => String(item.category || '').trim())
          .filter((name) => name.length > 0)
      )
    );
    
    const withoutTodos = uniqueCategories.filter(
      (name) => name.toLowerCase() !== "todos"
    );
    
    withoutTodos.sort((a, b) => a.localeCompare(b));
    return ["todos", ...withoutTodos];
  }, [allProducts]);

  // Memoized filtered products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "todos") {
      return allProducts;
    }

    const categoryName = categories.find((cat: string) => cat === selectedCategory);
    return allProducts.filter((product: Product) => product.category === categoryName);
  }, [selectedCategory, allProducts, categories]);

  // Enhanced error message
  const errorMessage = useMemo(() => {
    if (!error) return null;
    
    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('fetch')) {
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      // Google Sheets specific errors
      if (error.message.includes('403')) {
        return 'Acesso negado. Verifique as permissões da planilha.';
      }
      if (error.message.includes('404')) {
        return 'Planilha não encontrada. Verifique a configuração.';
      }
      return error.message;
    }
    
    return 'Erro desconhecido ao carregar produtos.';
  }, [error]);

  return {
    // Data
    products: filteredProducts,
    allProducts,
    categories,
    totalProducts: allProducts.length,
    
    // Category management
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