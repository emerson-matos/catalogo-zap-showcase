import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star, Eye, EyeOff } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface FlipbookCardProps {
  product: Product;
  pageNumber: number;
  isFlipping: boolean;
}

const FlipbookCard = React.memo(({ product, pageNumber, isFlipping }: FlipbookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative group">
      {/* Número da página */}
      <div className="absolute -top-4 -left-4 z-10">
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
          {pageNumber}
        </div>
      </div>

      {/* Card principal */}
      <Card 
        className={cn(
          "h-full bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-500 border-0",
          "transform perspective-1000",
          isHovered && "rotate-y-5 scale-105",
          isFlipping && "animate-pulse"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 relative overflow-hidden">
          {/* Imagem do produto */}
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className={cn(
                "w-full h-80 transition-all duration-500",
                isHovered && "scale-110 brightness-110",
                showDetails && "blur-sm"
              )}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            
            {/* Overlay com detalhes */}
            <div className={cn(
              "absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 flex items-center justify-center",
              showDetails ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <div className="text-center text-white p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-sm opacity-90 mb-4">{product.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold">{formatPriceBRL(product.price)}</span>
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            {product.isNew && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-accent to-accent/90 text-black dark:text-white font-bold shadow-lg border border-accent/20 backdrop-blur-sm animate-bounce">
                Novo
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:bg-white/95 dark:hover:bg-gray-800/95 transition-colors"
            >
              {product.category}
            </Badge>

            {/* Botão de detalhes */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Conteúdo do card */}
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

      {/* Efeito de sombra 3D */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg transition-all duration-500 -z-10",
        isHovered ? "opacity-100 scale-105" : "opacity-0"
      )} />
    </div>
  );
});

FlipbookCard.displayName = "FlipbookCard";

export default FlipbookCard;