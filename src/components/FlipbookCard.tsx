import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import type { Product } from "@/types/product";

interface FlipbookCardProps {
  product: Product;
  isLeftPage?: boolean;
  isRightPage?: boolean;
  pageNumber: number;
  totalPages: number;
}

const FlipbookCard = React.memo(({ 
  product, 
  isLeftPage = false, 
  isRightPage = false,
  pageNumber,
  totalPages 
}: FlipbookCardProps) => {
  return (
    <Card className={`
      relative h-[600px] w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
      shadow-2xl border-2 border-gray-200 dark:border-gray-700
      transform transition-all duration-500 ease-in-out
      ${isLeftPage ? 'origin-right' : ''}
      ${isRightPage ? 'origin-left' : ''}
      hover:shadow-3xl hover:scale-[1.02]
    `}>
      {/* Page number indicator */}
      <div className="absolute top-4 right-4 text-sm text-muted-foreground font-medium">
        {pageNumber} / {totalPages}
      </div>

      {/* Left page content */}
      {isLeftPage && (
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6">
              {product.isNew && (
                <Badge className="mb-4 bg-gradient-to-r from-accent to-accent/90 text-black dark:text-white font-bold shadow-lg">
                  Novo
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="mb-4 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold shadow-md"
              >
                {product.category}
              </Badge>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-primary leading-tight">
              {product.name}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                {formatPriceBRL(product.price)}
              </span>
              {product.rating && (
                <div className="flex items-center gap-2 bg-accent/10 dark:bg-accent/20 px-3 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            <WhatsAppButton
              product={product}
              className="w-full justify-center gap-3 h-14 text-lg font-medium shadow-button hover:shadow-lg transition-all duration-200"
              size="lg"
            >
              Consultar Produto
            </WhatsAppButton>
          </div>
        </CardContent>
      )}

      {/* Right page content */}
      {isRightPage && (
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative mb-8">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-80 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-3 text-primary">
                {product.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                Produto de alta qualidade com garantia de satisfação
              </p>
            </div>
          </div>
        </CardContent>
      )}

      {/* Page fold effect */}
      <div className={`
        absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700
        ${isLeftPage ? 'right-0' : 'left-0'}
        shadow-inner
      `}></div>
    </Card>
  );
});

FlipbookCard.displayName = "FlipbookCard";

export default FlipbookCard;