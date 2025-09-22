import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters: boolean;
  onAddProduct: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  hasFilters,
  onAddProduct,
}) => {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500 mt-1">
            {hasFilters
              ? 'Tente ajustar os filtros de busca'
              : 'Adicione seu primeiro produto'}
          </p>
        </div>
        {!hasFilters && (
          <Button onClick={onAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        )}
      </div>
    </Card>
  );
});