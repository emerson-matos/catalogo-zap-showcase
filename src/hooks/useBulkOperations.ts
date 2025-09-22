import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAdminProducts } from './useAdminProducts';
import type { Product } from '@/lib/supabase';

export interface UseBulkOperationsReturn {
  selectedProducts: Set<string>;
  showBulkActions: boolean;
  isBulkDeleting: boolean;
  selectProduct: (productId: string) => void;
  selectAll: (products: Product[]) => void;
  clearSelection: () => void;
  bulkDelete: () => Promise<void>;
  exportProducts: (products: Product[]) => void;
}

export const useBulkOperations = (): UseBulkOperationsReturn => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  const { deleteProduct } = useAdminProducts();

  const selectProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      setShowBulkActions(newSelected.size > 0);
      return newSelected;
    });
  }, []);

  const selectAll = useCallback((products: Product[]) => {
    setSelectedProducts(prev => {
      if (prev.size === products.length) {
        setShowBulkActions(false);
        return new Set();
      } else {
        setShowBulkActions(true);
        return new Set(products.map(p => p.id));
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProducts(new Set());
    setShowBulkActions(false);
  }, []);

  const bulkDelete = useCallback(async () => {
    if (selectedProducts.size === 0) return;
    
    if (confirm(`Tem certeza que deseja deletar ${selectedProducts.size} produtos? Esta ação não pode ser desfeita.`)) {
      setIsBulkDeleting(true);
      try {
        const deletePromises = Array.from(selectedProducts).map(id => deleteProduct(id));
        await Promise.all(deletePromises);
        toast.success(`${selectedProducts.size} produtos deletados com sucesso!`);
        clearSelection();
      } catch (err) {
        console.error('Error bulk deleting products:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produtos';
        toast.error(errorMessage, {
          description: 'Alguns produtos podem não ter sido deletados. Verifique e tente novamente.',
          duration: 5000,
        });
      } finally {
        setIsBulkDeleting(false);
      }
    }
  }, [selectedProducts, deleteProduct, clearSelection]);

  const exportProducts = useCallback((products: Product[]) => {
    const productsToExport = products.filter(p => selectedProducts.has(p.id));
    
    if (productsToExport.length === 0) {
      toast.error('Nenhum produto selecionado para exportar');
      return;
    }

    const csvContent = [
      ['Nome', 'Descrição', 'Preço', 'Categoria', 'Avaliação', 'Novo'],
      ...productsToExport.map(p => [
        p.name,
        p.description,
        p.price.toString(),
        p.category,
        p.rating?.toString() || '',
        p.is_new ? 'Sim' : 'Não'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produtos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Produtos exportados com sucesso!');
  }, [selectedProducts]);

  return {
    selectedProducts,
    showBulkActions,
    isBulkDeleting,
    selectProduct,
    selectAll,
    clearSelection,
    bulkDelete,
    exportProducts,
  };
};