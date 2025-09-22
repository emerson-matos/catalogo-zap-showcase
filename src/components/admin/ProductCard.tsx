import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/supabase';
import type { ViewMode } from '@/constants/admin';

interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: (productId: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const handleSelect = () => onSelect(product.id);
  const handleEdit = () => onEdit(product);
  const handleDelete = () => onDelete(product.id);

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow ${
        viewMode === 'list' ? 'flex flex-row' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className={`${
        viewMode === 'grid' ? 'aspect-square relative' : 'w-32 h-32 flex-shrink-0 relative'
      }`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>
      <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">
            {product.name}
          </h3>
          <div className="flex gap-1">
            {product.is_new && (
              <Badge variant="secondary" className="text-xs">Novo</Badge>
            )}
            {product.rating && (
              <Badge variant="outline" className="text-xs">⭐ {product.rating}</Badge>
            )}
          </div>
        </div>
        <p className={`text-sm text-gray-600 mb-2 ${
          viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'
        }`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg">
              R$ {product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">
              {product.category}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});