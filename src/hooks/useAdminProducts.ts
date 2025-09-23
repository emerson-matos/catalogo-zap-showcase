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

  const createProductWithImageMutation = useMutation({
    mutationFn: ({ productData, imageFile }: { 
      productData: Omit<ProductInsert, 'image'>; 
      imageFile: File 
    }) => SupabaseService.createProductWithImage(productData, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const updateProductWithImageMutation = useMutation({
    mutationFn: ({ id, updates, imageFile }: { 
      id: string; 
      updates: Omit<ProductUpdate, 'image'>; 
      imageFile: File 
    }) => SupabaseService.updateProductWithImage(id, updates, imageFile),
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

  const createProductWithImage = async (productData: Omit<ProductInsert, 'image'>, imageFile: File) => {
    return createProductWithImageMutation.mutateAsync({ productData, imageFile });
  };

  const updateProductWithImage = async (id: string, updates: Omit<ProductUpdate, 'image'>, imageFile: File) => {
    return updateProductWithImageMutation.mutateAsync({ id, updates, imageFile });
  };

  return {
    // Mutations
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    createProductWithImageMutation,
    updateProductWithImageMutation,

    // Actions
    createProduct,
    updateProduct,
    deleteProduct,
    createProductWithImage,
    updateProductWithImage,

    // States
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isCreatingWithImage: createProductWithImageMutation.isPending,
    isUpdatingWithImage: updateProductWithImageMutation.isPending,
    isMutating:
      createProductMutation.isPending ||
      updateProductMutation.isPending ||
      deleteProductMutation.isPending ||
      createProductWithImageMutation.isPending ||
      updateProductWithImageMutation.isPending,
  };
};

