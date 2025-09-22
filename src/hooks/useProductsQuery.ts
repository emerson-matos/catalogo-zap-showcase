import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { SupabaseService } from "@/lib/supabaseService";
import { queryKeys } from "@/lib/queryClient";
import type { Product } from "@/lib/supabase";

export const useProductsQuery = () => {
  const {
    data: products = [],
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
    isStale,
  } = useQuery({
    queryKey: queryKeys.products.supabase(),
    queryFn: SupabaseService.getProducts,
  });

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      }
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
    products,
    isLoading,
    isFetching,
    isError,
    error: errorMessage,
    isStale,
    refetch,
    isEmpty: !isLoading && products.length === 0,
  };
};

// Hook for prefetching products (useful for critical pages)
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  const prefetchProducts = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.supabase(),
      queryFn: SupabaseService.getProducts,
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
      queryKey: queryKeys.products.supabase(),
    });
  };

  return { invalidateProducts, refetchProducts };
};

