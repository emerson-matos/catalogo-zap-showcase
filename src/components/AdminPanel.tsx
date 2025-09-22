import React, { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Hooks
import { useProductsQuery } from '@/hooks/useProductsQuery';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useAuth } from '@/hooks/useAuth';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useBulkOperations } from '@/hooks/useBulkOperations';
import { useProductForm } from '@/hooks/useProductForm';

// Components
import { SearchAndFilters } from '@/components/admin/SearchAndFilters';
import { BulkActions } from '@/components/admin/BulkActions';
import { ProductCard } from '@/components/admin/ProductCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { ProductForm } from '@/components/admin/ProductForm';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';

// Constants
import { VIEW_MODES } from '@/constants/admin';
import type { ViewMode } from '@/constants/admin';

export const AdminPanel: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.GRID);

  const { user } = useAuth();
  const { products, isLoading } = useProductsQuery();
  const { deleteProduct } = useAdminProducts();

  // Custom hooks for business logic
  const {
    filters,
    filteredProducts,
    categories,
    updateSearchQuery,
    updateCategory,
    toggleNewOnly,
  } = useProductFilters(products);

  const {
    selectedProducts,
    showBulkActions,
    isBulkDeleting,
    selectProduct,
    selectAll,
    clearSelection,
    bulkDelete,
    exportProducts,
  } = useBulkOperations();

  const {
    form,
    editingProduct,
    imagePreview,
    setEditingProduct,
    handleImageChange,
    onSubmit,
    resetForm,
  } = useProductForm();

  // Memoized handlers
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleProductEdit = useCallback((product: any) => {
    setEditingProduct(product);
  }, [setEditingProduct]);

  const handleProductDelete = useCallback(async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deleteProduct(id);
        toast.success('Produto deletado com sucesso!');
        // Remove from selected products if it was selected
        const newSelected = new Set(selectedProducts);
        newSelected.delete(id);
        if (newSelected.size === 0) {
          clearSelection();
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produto';
        toast.error(errorMessage, {
          description: 'Tente novamente ou contate o suporte',
          duration: 5000,
        });
      }
    }
  }, [deleteProduct, selectedProducts, clearSelection]);

  const handleSelectAll = useCallback(() => {
    selectAll(filteredProducts);
  }, [selectAll, filteredProducts]);

  const handleExport = useCallback(() => {
    exportProducts(filteredProducts);
  }, [exportProducts, filteredProducts]);

  const handleCancelEdit = useCallback(() => {
    setEditingProduct(null);
    resetForm();
  }, [setEditingProduct, resetForm]);

  const hasFilters = filters.searchQuery || filters.selectedCategory !== 'all' || filters.showNewOnly;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <div className="shadow-sm border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Bem-vindo, {user?.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {filteredProducts.length} produtos
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="add-product">Adicionar Produto</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              {/* Search and Filters */}
              <SearchAndFilters
                searchQuery={filters.searchQuery}
                selectedCategory={filters.selectedCategory}
                showNewOnly={filters.showNewOnly}
                viewMode={viewMode}
                categories={categories}
                onSearchChange={updateSearchQuery}
                onCategoryChange={updateCategory}
                onToggleNewOnly={toggleNewOnly}
                onViewModeChange={handleViewModeChange}
              />

              {/* Bulk Actions */}
              {showBulkActions && (
                <BulkActions
                  selectedCount={selectedProducts.size}
                  totalCount={filteredProducts.length}
                  isBulkDeleting={isBulkDeleting}
                  onSelectAll={handleSelectAll}
                  onExport={handleExport}
                  onBulkDelete={bulkDelete}
                />
              )}

              {/* Products List */}
              {filteredProducts.length === 0 ? (
                <EmptyState
                  hasFilters={hasFilters}
                  onAddProduct={() => setEditingProduct(null)}
                />
              ) : (
                <div className={
                  viewMode === VIEW_MODES.GRID
                    ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      isSelected={selectedProducts.has(product.id)}
                      onSelect={selectProduct}
                      onEdit={handleProductEdit}
                      onDelete={handleProductDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-product">
              <ProductForm
                form={form}
                editingProduct={editingProduct}
                imagePreview={imagePreview}
                isMutating={false} // This should come from the hook
                onImageChange={handleImageChange}
                onSubmit={onSubmit}
                onCancel={handleCancelEdit}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminErrorBoundary>
  );
};
