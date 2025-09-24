import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { Edit, Star } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/types/product";
import { useCategoryQuery } from "@/hooks/useCategoryQuery";
import { Button } from "./ui/button";
import { ProtectedComponent } from "./ProtectedRoute";

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  const { data: category } = useCategoryQuery(product.category_id || "");
  const isNewProduct = () => {
    if (!product.created_at) return false;
    const createdDate = new Date(product.created_at);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  return (
    <Card className="group h-full bg-gray-800 border-gray-700 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl max-w-sm mx-auto">
      <CardContent className="p-0">
        <Link to="/products/$id" params={{ id: product.id }}>
          {/* Image Container with proper positioning */}
          <div className="relative overflow-hidden rounded-t-lg bg-white">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-64 transition-transform duration-300 group-hover:scale-110 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            
            {/* Tags positioned correctly - overlapping slightly */}
            {isNewProduct() && (
              <Badge className="absolute top-2 left-2 bg-green-700 text-white font-bold text-xs px-2 py-1 rounded shadow-lg z-10">
                Novo
              </Badge>
            )}
            <Badge className="absolute top-2 right-2 bg-gray-600 text-white font-semibold text-xs px-2 py-1 rounded shadow-lg z-10">
              {category?.name || "Beleza"}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="p-4 bg-gray-800">
            <h3 className="text-lg font-bold mb-2 text-white line-clamp-2 group-hover:text-gray-300 transition-colors">
              {product.name}
            </h3>
            
            {/* Price and Rating Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-1">
                  A partir 25 unid.
                </span>
                <span className="text-xl font-bold text-white">
                  {formatPriceBRL(product.price)}
                </span>
              </div>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="size-4 text-gray-400 fill-current" />
                  <span className="text-sm font-medium text-gray-400">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-4 pt-0 bg-gray-800">
        <div className="flex gap-2 w-full">
          <ProtectedComponent requiredRole="editor">
            <Button 
              asChild 
              size="sm" 
              variant="outline"
              className="flex-1 bg-gray-600 border-gray-500 text-white hover:bg-gray-500 hover:text-white text-xs"
            >
              <Link to="/admin/products" search={{ id: product.id }}>
                <Edit className="size-3 mr-1" />
                <span>Editar</span>
              </Link>
            </Button>
          </ProtectedComponent>
          <WhatsAppButton 
            product={product} 
            className="flex-1 bg-gray-600 border-gray-500 text-white hover:bg-gray-500 hover:text-white text-xs"
            size="sm"
          >
            Consultar
          </WhatsAppButton>
          <AddToCartButton 
            product={product} 
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-100 border-gray-300 text-xs"
            size="sm"
          >
            Adicionar
          </AddToCartButton>
        </div>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
