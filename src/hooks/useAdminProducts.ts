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

  const createProductWithImagesMutation = useMutation({
    mutationFn: ({ productData, imageFiles }: { productData: Omit<ProductInsert, 'images'>; imageFiles: File[] }) =>
      SupabaseService.createProductWithImages(productData, imageFiles),
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

  const updateProductWithImagesMutation = useMutation({
    mutationFn: ({ id, updates, imageFiles, imagesToRemove }: { id: string; updates: Omit<ProductUpdate, 'images'>; imageFiles?: File[]; imagesToRemove?: string[] }) =>
      SupabaseService.updateProductWithImages(id, updates, imageFiles, imagesToRemove),
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

  const createProductWithImages = async (productData: Omit<ProductInsert, 'images'>, imageFiles: File[]) => {
    return createProductWithImagesMutation.mutateAsync({ productData, imageFiles });
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    return updateProductMutation.mutateAsync({ id, updates });
  };

  const updateProductWithImages = async (id: string, updates: Omit<ProductUpdate, 'images'>, imageFiles?: File[], imagesToRemove?: string[]) => {
    return updateProductWithImagesMutation.mutateAsync({ id, updates, imageFiles, imagesToRemove });
  };

  const deleteProduct = async (id: string) => {
    return deleteProductMutation.mutateAsync(id);
  };

  return {
    // Mutations
    createProductMutation,
    createProductWithImagesMutation,
    updateProductMutation,
    updateProductWithImagesMutation,
    deleteProductMutation,

    // Actions
    createProduct,
    createProductWithImages,
    updateProduct,
    updateProductWithImages,
    deleteProduct,

    // States
    isCreating: createProductMutation.isPending,
    isCreatingWithImages: createProductWithImagesMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isUpdatingWithImages: updateProductWithImagesMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isMutating:
      createProductMutation.isPending ||
      createProductWithImagesMutation.isPending ||
      updateProductMutation.isPending ||
      updateProductWithImagesMutation.isPending ||
      deleteProductMutation.isPending,
  };
};