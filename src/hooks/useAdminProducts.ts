import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseService } from '@/lib/supabaseService'
import { queryKeys, queryKeyUtils } from '@/lib/queryClient'
import type { ProductInsert, ProductUpdate, Product } from '@/lib/supabase'
import { toast } from 'sonner'

export const useAdminProducts = () => {
  const queryClient = useQueryClient()

  // Enhanced create mutation with optimistic updates
  const createProductMutation = useMutation({
    mutationKey: ['products', 'create'],
    mutationFn: SupabaseService.createProduct,
    onMutate: async (newProduct: ProductInsert) => {
      // Cancel any outgoing refetches to prevent overriding optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all })

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(queryKeys.products.supabase())

      // Optimistically update to the new value
      const optimisticProduct: Product = {
        id: `temp-${Date.now()}`, // Temporary ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...newProduct,
      } as Product

      queryClient.setQueryData(queryKeys.products.supabase(), (old: Product[] = []) => [
        optimisticProduct,
        ...old,
      ])

      // Return a context object with the snapshotted value
      return { previousProducts, optimisticProduct }
    },
    onError: (err, newProduct, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.supabase(), context.previousProducts)
      }
      toast.error('Erro ao criar produto. Tente novamente.')
    },
    onSuccess: (createdProduct, variables, context) => {
      // Replace the optimistic update with the actual data
      if (context?.optimisticProduct) {
        queryClient.setQueryData(queryKeys.products.supabase(), (old: Product[] = []) =>
          old.map(product => 
            product.id === context.optimisticProduct.id ? createdProduct : product
          )
        )
      }
      
      // Invalidate and refetch
      queryKeyUtils.invalidateProductQueries(queryClient)
      toast.success('Produto criado com sucesso!')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })

  // Enhanced create with images mutation (from main branch)
  const createProductWithImagesMutation = useMutation({
    mutationKey: ['products', 'create', 'with-images'],
    mutationFn: ({ productData, imageFiles }: { productData: Omit<ProductInsert, 'images'>; imageFiles: File[] }) =>
      SupabaseService.createProductWithImages(productData, imageFiles),
    onMutate: async ({ productData, imageFiles }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all })

      const previousProducts = queryClient.getQueryData(queryKeys.products.supabase())

      // Create optimistic product with placeholder images
      const optimisticProduct: Product = {
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...productData,
        images: imageFiles.map((file, index) => ({
          url: URL.createObjectURL(file),
          alt: `Image ${index + 1}`,
          isPrimary: index === 0,
        })),
      } as Product

      queryClient.setQueryData(queryKeys.products.supabase(), (old: Product[] = []) => [
        optimisticProduct,
        ...old,
      ])

      return { previousProducts, optimisticProduct }
    },
    onError: (err, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.supabase(), context.previousProducts)
      }
      toast.error('Erro ao criar produto com imagens. Tente novamente.')
    },
    onSuccess: (createdProduct, variables, context) => {
      if (context?.optimisticProduct) {
        queryClient.setQueryData(queryKeys.products.supabase(), (old: Product[] = []) =>
          old.map(product => 
            product.id === context.optimisticProduct.id ? createdProduct : product
          )
        )
      }
      queryKeyUtils.invalidateProductQueries(queryClient)
      toast.success('Produto criado com imagens!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })

  // Enhanced update mutation with optimistic updates
  const updateProductMutation = useMutation({
    mutationKey: ['products', 'update'],
    mutationFn: ({ id, updates }: { id: string; updates: ProductUpdate }) =>
      SupabaseService.updateProduct(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all })

      // Get previous data
      const previousProducts = queryClient.getQueryData(queryKeys.products.supabase())
      const previousProduct = queryKeyUtils.getCachedProduct(queryClient, id)

      // Optimistically update the product
      queryKeyUtils.updateProductInCaches(queryClient, id, (old: Product) => ({
        ...old,
        ...updates,
        updated_at: new Date().toISOString(),
      }))

      return { previousProducts, previousProduct, id }
    },
    onError: (err, variables, context) => {
      // Roll back on error
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.supabase(), context.previousProducts)
      }
      if (context?.previousProduct && context?.id) {
        queryKeyUtils.setProductInCache(queryClient, context.id, context.previousProduct)
      }
      toast.error('Erro ao atualizar produto. Tente novamente.')
    },
    onSuccess: (updatedProduct, variables, context) => {
      // Update with server response
      if (updatedProduct && variables.id) {
        queryKeyUtils.setProductInCache(queryClient, variables.id, updatedProduct)
      }
      queryKeyUtils.invalidateProductQueries(queryClient)
      toast.success('Produto atualizado com sucesso!')
    },
  })

  // Enhanced update with images mutation (from main branch)
  const updateProductWithImagesMutation = useMutation({
    mutationKey: ['products', 'update', 'with-images'],
    mutationFn: ({ id, updates, imageFiles, imagesToRemove }: { id: string; updates: Omit<ProductUpdate, 'images'>; imageFiles?: File[]; imagesToRemove?: string[] }) =>
      SupabaseService.updateProductWithImages(id, updates, imageFiles, imagesToRemove),
    onMutate: async ({ id, updates, imageFiles, imagesToRemove }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all })

      const previousProducts = queryClient.getQueryData(queryKeys.products.supabase())
      const previousProduct = queryKeyUtils.getCachedProduct(queryClient, id)

      // Optimistically update with new images
      queryKeyUtils.updateProductInCaches(queryClient, id, (old: Product) => {
        let newImages = [...(old.images || [])]
        
        // Remove images that are marked for removal
        if (imagesToRemove) {
          newImages = newImages.filter(img => !imagesToRemove.includes(img.url))
        }
        
        // Add new images as placeholders
        if (imageFiles) {
          const placeholderImages = imageFiles.map((file, index) => ({
            url: URL.createObjectURL(file),
            alt: `New Image ${index + 1}`,
            isPrimary: newImages.length === 0 && index === 0,
          }))
          newImages = [...newImages, ...placeholderImages]
        }

        return {
          ...old,
          ...updates,
          images: newImages,
          updated_at: new Date().toISOString(),
        }
      })

      return { previousProducts, previousProduct, id }
    },
    onError: (err, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.supabase(), context.previousProducts)
      }
      if (context?.previousProduct && context?.id) {
        queryKeyUtils.setProductInCache(queryClient, context.id, context.previousProduct)
      }
      toast.error('Erro ao atualizar produto com imagens. Tente novamente.')
    },
    onSuccess: (updatedProduct, variables, context) => {
      if (updatedProduct && variables.id) {
        queryKeyUtils.setProductInCache(queryClient, variables.id, updatedProduct)
      }
      queryKeyUtils.invalidateProductQueries(queryClient)
      toast.success('Produto atualizado com imagens!')
    },
  })

  // Enhanced delete mutation with optimistic updates
  const deleteProductMutation = useMutation({
    mutationKey: ['products', 'delete'],
    mutationFn: SupabaseService.deleteProduct,
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all })

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(queryKeys.products.supabase())
      const productToDelete = queryKeyUtils.getCachedProduct(queryClient, productId)

      // Optimistically remove the product
      queryClient.setQueryData(queryKeys.products.supabase(), (old: Product[] = []) =>
        old.filter(product => product.id !== productId)
      )

      // Remove from individual cache
      queryKeyUtils.removeProductFromCache(queryClient, productId)

      return { previousProducts, productToDelete, productId }
    },
    onError: (err, productId, context) => {
      // Roll back on error
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.supabase(), context.previousProducts)
      }
      if (context?.productToDelete && context?.productId) {
        queryKeyUtils.setProductInCache(queryClient, context.productId, context.productToDelete)
      }
      toast.error('Erro ao deletar produto. Tente novamente.')
    },
    onSuccess: (_, productId, context) => {
      queryKeyUtils.invalidateProductQueries(queryClient)
      toast.success('Produto deletado com sucesso!')
    },
  })

  // Helper functions with enhanced error handling
  const createProduct = async (productData: ProductInsert) => {
    try {
      return await createProductMutation.mutateAsync(productData)
    } catch (error) {
      console.error('Create product failed:', error)
      throw error
    }
  }

  const createProductWithImages = async (productData: Omit<ProductInsert, 'images'>, imageFiles: File[]) => {
    try {
      return await createProductWithImagesMutation.mutateAsync({ productData, imageFiles })
    } catch (error) {
      console.error('Create product with images failed:', error)
      throw error
    }
  }

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    try {
      return await updateProductMutation.mutateAsync({ id, updates })
    } catch (error) {
      console.error('Update product failed:', error)
      throw error
    }
  }

  const updateProductWithImages = async (id: string, updates: Omit<ProductUpdate, 'images'>, imageFiles?: File[], imagesToRemove?: string[]) => {
    try {
      return await updateProductWithImagesMutation.mutateAsync({ id, updates, imageFiles, imagesToRemove })
    } catch (error) {
      console.error('Update product with images failed:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      return await deleteProductMutation.mutateAsync(id)
    } catch (error) {
      console.error('Delete product failed:', error)
      throw error
    }
  }

  return {
    // Mutations (enhanced with optimistic updates + image support from main)
    createProductMutation,
    createProductWithImagesMutation,
    updateProductMutation,
    updateProductWithImagesMutation,
    deleteProductMutation,
    
    // Actions with better error handling
    createProduct,
    createProductWithImages,
    updateProduct,  
    updateProductWithImages,
    deleteProduct,
    
    // Enhanced states (combined from both versions)
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

    // Error states for better UX
    createError: createProductMutation.error,
    updateError: updateProductMutation.error,
    deleteError: deleteProductMutation.error,
    hasErrors: !!(
      createProductMutation.error ||
      createProductWithImagesMutation.error ||
      updateProductMutation.error ||
      updateProductWithImagesMutation.error ||
      deleteProductMutation.error
    ),
  }
}