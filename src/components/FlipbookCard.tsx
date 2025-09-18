import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import type { Product } from "@/types/product";

interface FlipbookCardProps {
  product: Product;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlipbookCard = React.memo(({ product, isFlipped, onFlip }: FlipbookCardProps) => {
  return (
    <div className="relative w-full h-[500px] perspective-1000">
      <div 
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
      >
        {/* Front of the card */}
        <Card className="absolute w-full h-full backface-hidden bg-gradient-card shadow-card border-0">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="relative overflow-hidden rounded-t-lg flex-1">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-accent to-accent/90 text-black dark:text-white font-bold shadow-lg border border-accent/20 backdrop-blur-sm">
                  Novo
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
              >
                {product.category}
              </Badge>
              
              {/* Flip indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                Clique para ver detalhes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card className="absolute w-full h-full backface-hidden bg-gradient-card shadow-card border-0 rotate-y-180">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-primary">
                  {product.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-accent/20 text-accent-foreground font-semibold"
                >
                  {product.category}
                </Badge>
              </div>

              <div className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                    {formatPriceBRL(product.price)}
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-1 bg-accent/10 dark:bg-accent/20 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <WhatsAppButton
                product={product}
                className="w-full justify-center gap-2 h-12 text-sm font-medium shadow-button hover:shadow-lg transition-all duration-200"
                size="default"
              >
                Consultar Produto
              </WhatsAppButton>
              
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  <ChevronLeft className="w-4 h-4" />
                  Clique para voltar
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

FlipbookCard.displayName = "FlipbookCard";

export default FlipbookCard;