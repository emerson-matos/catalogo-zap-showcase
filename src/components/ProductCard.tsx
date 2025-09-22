import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { Star } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  return (
    <Card className="group h-full bg-card shadow-lg border border-border transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-64 transition-transform duration-300 group-hover:scale-110 object-scale-down bg-background"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          {product.is_new && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-bold shadow border border-border">
              Novo
            </Badge>
          )}
          <Badge
            className="absolute top-3 right-3 bg-muted text-muted-foreground font-semibold shadow border border-border"
          >
            {product.category}
          </Badge>
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
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                <Star className="size-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  {product.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 space-x-2">
        <AddToCartButton
          product={product}
          className="flex-1 justify-center gap-2 h-11 text-sm font-medium shadow hover:shadow-lg transition-all duration-200 bg-primary text-primary-foreground"
          size="default"
        >
          Adicionar
        </AddToCartButton>
        <WhatsAppButton
          product={product}
          className="flex-1 justify-center gap-2 h-11 text-sm font-medium shadow hover:shadow-lg transition-all duration-200 bg-accent text-accent-foreground"
          size="default"
        >
          Consultar
        </WhatsAppButton>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
