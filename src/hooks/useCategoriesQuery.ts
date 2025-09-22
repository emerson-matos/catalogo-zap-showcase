import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { SupabaseService } from "@/lib/supabaseService";
import { queryKeys } from "@/lib/queryClient";
import type { Category } from "@/lib/supabase";

export const useCategoriesQuery = () => {
  const {
    data: categories = [],
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
    isStale,
  } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: SupabaseService.getCategories,
  });

  // Enhanced error message
  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof Error) {
      // Network errors
      if (error.message.includes("fetch")) {
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      return error.message;
    }

    return "Erro desconhecido ao carregar categorias.";
  }, [error]);

  return {
    // Data
    categories,
    totalCategories: categories.length,

    // Query states
    isLoading,
    isFetching,
    isError,
    error: errorMessage,
    isStale,

    // Actions
    refetch,

    // Computed states
    isEmpty: !isLoading && categories.length === 0,
    hasCategories: categories.length > 0,
  };
};

// Hook for prefetching categories (useful for critical pages)
export const usePrefetchCategories = () => {
  const queryClient = useQueryClient();

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.list(),
      queryFn: SupabaseService.getCategories,
    });
  };

  return { prefetchCategories };
};

// Hook for invalidating and refetching categories (useful for admin actions)
export const useInvalidateCategories = () => {
  const queryClient = useQueryClient();

  const invalidateCategories = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.categories.all,
    });
  };

  const refetchCategories = () => {
    queryClient.refetchQueries({
      queryKey: queryKeys.categories.list(),
    });
  };

  return { invalidateCategories, refetchCategories };
};

// Hook for getting a single category by ID
export const useCategoryQuery = (categoryId: string) => {
  const {
    data: category,
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.categories.byId(categoryId),
    queryFn: () => SupabaseService.getCategoryById(categoryId),
    enabled: !!categoryId,
  });

  return {
    category,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};