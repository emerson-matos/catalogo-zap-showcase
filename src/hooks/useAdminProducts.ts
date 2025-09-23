import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseService } from "@/lib/supabaseService";
import { queryKeys } from "@/lib/queryClient";
import type { ProductInsert, ProductUpdate } from "@/lib/supabase";

export const useAdminProducts = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: SupabaseService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProductUpdate }) =>
      SupabaseService.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: SupabaseService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const createProduct = async (productData: ProductInsert) => {
    return createProductMutation.mutateAsync(productData);
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    return updateProductMutation.mutateAsync({ id, updates });
  };

  const deleteProduct = async (id: string) => {
    return deleteProductMutation.mutateAsync(id);
  };

  return {
    // Mutations
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,

    // Actions
    createProduct,
    updateProduct,
    deleteProduct,

    // States
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isMutating:
      createProductMutation.isPending ||
      updateProductMutation.isPending ||
      deleteProductMutation.isPending,
  };
};

