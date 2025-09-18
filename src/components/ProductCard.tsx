import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  return (
    <Card className="group h-full bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 border-0">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-64 transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          {product.isNew && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-accent to-accent/90 text-black dark:text-white font-bold shadow-lg border border-accent/20 backdrop-blur-sm">
              Novo
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:bg-white/95 dark:hover:bg-gray-800/95 transition-colors"
          >
            {product.category}
          </Badge>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
              {formatPriceBRL(product.price)}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 bg-accent/10 dark:bg-accent/20 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {product.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <WhatsAppButton
          product={product}
          className="w-full justify-center gap-2 h-11 text-sm font-medium shadow-button hover:shadow-lg transition-all duration-200"
          size="default"
        >
          Consultar Produto
        </WhatsAppButton>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
