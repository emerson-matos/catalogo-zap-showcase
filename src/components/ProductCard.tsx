import React, { useMemo } from "react";
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
  
  const isNewProduct = useMemo(() => {
    if (!product.created_at) return false;
    const createdDate = new Date(product.created_at);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }, [product.created_at]);
  return (
    <Card className="group h-full shadow-lg border border-border transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <Link to="/products/$id" params={{ id: product.id }}>
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-64 transition-transform duration-300 group-hover:scale-110 object-contain"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            {isNewProduct && (
              <Badge className="absolute top-2 left-2 bg-muted text-green-600 font-bold shadow border border-border">
                Novo
              </Badge>
            )}
            {category?.name && (
              <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground font-semibold shadow border border-border">
                {category.name}
              </Badge>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
              {product.name}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-primary">
                {formatPriceBRL(product.price)}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full">
                  <Star className="size-4 text-accent-foreground" />
                  <span className="text-sm font-medium text-primary">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 p-4">
        <ProtectedComponent requiredRole="editor">
          <Button asChild size="sm" variant="outline" className="flex-shrink-0">
            <Link to="/admin/products" search={{ id: product.id }}>
              <Edit className="size-4 mr-1" />
              <span className="hidden sm:inline">Editar</span>
            </Link>
          </Button>
        </ProtectedComponent>
        <WhatsAppButton product={product} className="flex-1 min-w-0" size="sm">
          <span className="hidden sm:inline">Consultar</span>
          <span className="sm:hidden">WhatsApp</span>
        </WhatsAppButton>
        <AddToCartButton product={product} className="flex-1 min-w-0" size="sm">
          <span className="hidden sm:inline">Adicionar</span>
          <span className="sm:hidden">Carrinho</span>
        </AddToCartButton>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
