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
    mutationFn: ({ id, updates, oldImageUrl }: { id: string; updates: ProductUpdate; oldImageUrl?: string }) =>
      SupabaseService.updateProduct(id, updates, oldImageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl?: string }) =>
      SupabaseService.deleteProduct(id, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const createProduct = async (productData: ProductInsert) => {
    return createProductMutation.mutateAsync(productData);
  };

  const updateProduct = async (id: string, updates: ProductUpdate, oldImageUrl?: string) => {
    return updateProductMutation.mutateAsync({ id, updates, oldImageUrl });
  };

  const deleteProduct = async (id: string, imageUrl?: string) => {
    return deleteProductMutation.mutateAsync({ id, imageUrl });
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

