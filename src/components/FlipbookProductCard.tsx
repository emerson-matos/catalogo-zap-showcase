import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import type { Product } from "@/types/product";

interface FlipbookProductCardProps {
  product: Product;
  isFlipped?: boolean;
  onFlip?: () => void;
}

const FlipbookProductCard = React.memo(({ product, isFlipped = false, onFlip }: FlipbookProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full h-[500px] perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
      >
        {/* Frente do cartão */}
        <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 border-0">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="relative overflow-hidden rounded-t-lg flex-1">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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
              
              {/* Indicador de flip */}
              <div className={`absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                Clique para ver detalhes
              </div>
            </div>

            <div className="p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
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
        </Card>

        {/* Verso do cartão */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-card shadow-card border-0">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="secondary"
                  className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                >
                  {product.category}
                </Badge>
                {product.isNew && (
                  <Badge className="bg-gradient-to-r from-accent to-accent/90 text-black dark:text-white font-bold shadow-lg border border-accent/20 backdrop-blur-sm">
                    Novo
                  </Badge>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-4 text-primary">
                {product.name}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Preço:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPriceBRL(product.price)}
                  </span>
                </div>
                
                {product.rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avaliação:</span>
                    <div className="flex items-center gap-1 bg-accent/10 dark:bg-accent/20 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <CardFooter className="p-0 mt-6">
              <WhatsAppButton
                product={product}
                className="w-full justify-center gap-2 h-11 text-sm font-medium shadow-button hover:shadow-lg transition-all duration-200"
                size="default"
              >
                Consultar Produto
              </WhatsAppButton>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

FlipbookProductCard.displayName = "FlipbookProductCard";

export default FlipbookProductCard;