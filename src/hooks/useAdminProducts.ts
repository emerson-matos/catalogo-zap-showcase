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

  // Batch operations for efficiency
  const batchUpdateProducts = useMutation({
    mutationKey: ['products', 'batch-update'],
    mutationFn: async (updates: { id: string; updates: ProductUpdate }[]) => {
      const promises = updates.map(({ id, updates }) => 
        SupabaseService.updateProduct(id, updates)
      )
      return Promise.all(promises)
    },
    onSuccess: () => {
      queryKeyUtils.invalidateProductQueries(queryClient)
      toast.success(`${batchUpdateProducts.variables?.length || 0} produtos atualizados!`)
    },
    onError: () => {
      toast.error('Erro ao atualizar produtos em lote.')
    },
  })

  const batchDeleteProducts = useMutation({
    mutationKey: ['products', 'batch-delete'],
    mutationFn: async (productIds: string[]) => {
      const promises = productIds.map(id => SupabaseService.deleteProduct(id))
      return Promise.all(promises)
    },
    onSuccess: (_, productIds) => {
      queryKeyUtils.invalidateProductQueries(queryClient)
      toast.success(`${productIds.length} produtos deletados!`)
    },
    onError: () => {
      toast.error('Erro ao deletar produtos em lote.')
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

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    try {
      return await updateProductMutation.mutateAsync({ id, updates })
    } catch (error) {
      console.error('Update product failed:', error)
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

  const updateMultipleProducts = async (updates: { id: string; updates: ProductUpdate }[]) => {
    try {
      return await batchUpdateProducts.mutateAsync(updates)
    } catch (error) {
      console.error('Batch update failed:', error)
      throw error
    }
  }

  const deleteMultipleProducts = async (productIds: string[]) => {
    try {
      return await batchDeleteProducts.mutateAsync(productIds)
    } catch (error) {
      console.error('Batch delete failed:', error)
      throw error
    }
  }

  return {
    // Mutations
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    batchUpdateProducts,
    batchDeleteProducts,
    
    // Actions with better error handling
    createProduct,
    updateProduct,
    deleteProduct,
    updateMultipleProducts,
    deleteMultipleProducts,
    
    // Enhanced states
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isBatchUpdating: batchUpdateProducts.isPending,
    isBatchDeleting: batchDeleteProducts.isPending,
    isMutating: 
      createProductMutation.isPending || 
      updateProductMutation.isPending || 
      deleteProductMutation.isPending ||
      batchUpdateProducts.isPending ||
      batchDeleteProducts.isPending,

    // Error states for better UX
    createError: createProductMutation.error,
    updateError: updateProductMutation.error,
    deleteError: deleteProductMutation.error,
    hasErrors: !!(
      createProductMutation.error ||
      updateProductMutation.error ||
      deleteProductMutation.error ||
      batchUpdateProducts.error ||
      batchDeleteProducts.error
    ),
  }
}