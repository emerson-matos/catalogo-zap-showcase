import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import type { Product } from "@/types/product";

interface FlipbookProductCardProps {
  product: Product;
  index: number;
}

const FlipbookProductCard = React.memo(({ product, index }: FlipbookProductCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="flipbook-card perspective-1000"
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'slideInFromBottom 0.6s ease-out forwards'
      }}
    >
      <div 
        className={`flipbook-inner relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="flipbook-front absolute w-full h-full backface-hidden">
          <Card className="group h-full bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 border-0 cursor-pointer"
                onClick={handleFlip}>
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
                
                {/* Flip indicator */}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3" />
                  Ver detalhes
                </div>
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
              <div className="w-full flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Detalhes
                </button>
                <WhatsAppButton
                  product={product}
                  className="flex-1 justify-center gap-2 h-10 text-sm font-medium shadow-button hover:shadow-lg transition-all duration-200"
                  size="default"
                >
                  <ShoppingCart className="w-4 h-4" />
                </WhatsAppButton>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Back Side */}
        <div className="flipbook-back absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="h-full bg-gradient-to-br from-primary/5 to-accent/5 shadow-card border-0">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-primary">
                  {product.name}
                </h3>
                <button
                  onClick={handleFlip}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Descrição Completa</h4>
                  <p className="text-sm leading-relaxed text-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Preço</h4>
                    <p className="text-lg font-bold text-primary">
                      {formatPriceBRL(product.price)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Categoria</h4>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {product.rating && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Avaliação</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating!) 
                                ? 'fill-accent text-accent' 
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {product.rating}/5
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <WhatsAppButton
                  product={product}
                  className="w-full justify-center gap-2 h-11 text-sm font-medium shadow-button hover:shadow-lg transition-all duration-200"
                  size="default"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Consultar Produto
                </WhatsAppButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

FlipbookProductCard.displayName = "FlipbookProductCard";

export default FlipbookProductCard;