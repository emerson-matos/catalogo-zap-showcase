import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseService } from "@/lib/supabaseService";
import { queryKeys } from "@/lib/queryClient";
import type { ProductInsert, ProductUpdate } from "@/lib/supabase";

export const useAdminProducts = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: ({ productData, imageFile }: { productData: ProductInsert; imageFile?: File }) =>
      SupabaseService.createProduct(productData, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates, imageFile }: { id: string; updates: ProductUpdate; imageFile?: File }) =>
      SupabaseService.updateProduct(id, updates, imageFile),
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

  const createProduct = async (productData: ProductInsert, imageFile?: File) => {
    return createProductMutation.mutateAsync({ productData, imageFile });
  };

  const updateProduct = async (id: string, updates: ProductUpdate, imageFile?: File) => {
    return updateProductMutation.mutateAsync({ id, updates, imageFile });
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

