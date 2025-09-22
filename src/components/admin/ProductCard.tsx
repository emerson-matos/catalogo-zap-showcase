import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Product } from "@/lib/supabase";
import { isProductNew, formatPrice, handleImageError } from "@/utils/productUtils";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const isNew = isProductNew(product.created_at);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {isNew && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Novo
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex gap-1 ml-2">
            {product.rating && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                ⭐ {product.rating}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(product.price)}
            </span>
            <div className="text-xs text-gray-500 capitalize">{product.category}</div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(product)}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(product.id)}
              className="hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};