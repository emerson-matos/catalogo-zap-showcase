import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ChevronLeft, ChevronRight, Star, BookOpen } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import type { Product } from "@/types/product";

interface FlipbookProductViewerProps {
  className?: string;
}

const FlipbookProductViewer: React.FC<FlipbookProductViewerProps> = ({ className }) => {
  const { products, isLoading, error } = useProductsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipbookRef = useRef<HTMLDivElement>(null);

  // Organizar produtos em páginas (2 produtos por página)
  const productsPerPage = 2;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePageClick = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsFlipping(false);
      }, 300);
    }
  };

  // Auto-flip a cada 10 segundos
  useEffect(() => {
    if (totalPages <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 10000);

    return () => clearInterval(interval);
  }, [totalPages]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[600px] ${className}`}>
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[600px] ${className}`}>
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum produto disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flipbook-container ${className}`}>
      {/* Header do Flipbook */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Catálogo de Produtos</h2>
        </div>
        <p className="text-muted-foreground">
          Navegue pelas páginas do nosso catálogo digital
        </p>
      </div>

      {/* Flipbook Principal */}
      <div className="relative max-w-4xl mx-auto">
        {/* Controles de Navegação */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevPage}
            disabled={currentPage === 0 || isFlipping}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Página Anterior
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {currentPage + 1} de {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="flex items-center gap-2"
          >
            Próxima Página
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Página do Flipbook */}
        <div
          ref={flipbookRef}
          className={`flipbook-page relative bg-gradient-to-br from-background to-muted/20 rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-500 ${
            isFlipping ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
          }`}
        >
          {/* Efeito de página dobrada */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-transparent to-border/30 transform rotate-45 translate-x-4 -translate-y-4"></div>
          
          <div className="p-8 min-h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {currentProducts.map((product, index) => (
                <div key={product.id} className="flex flex-col">
                  <Card className="group h-full bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 border-0 flex-1">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative overflow-hidden rounded-t-lg flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
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
                          className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                        >
                          {product.category}
                        </Badge>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
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

                        <WhatsAppButton
                          product={product}
                          className="w-full justify-center gap-2 h-11 text-sm font-medium shadow-button hover:shadow-lg transition-all duration-200"
                          size="default"
                        >
                          Consultar Produto
                        </WhatsAppButton>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores de Página */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              disabled={isFlipping}
            />
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            {products.length}+
          </div>
          <div className="text-sm text-muted-foreground">Produtos no Catálogo</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg">
          <div className="text-2xl font-bold text-accent mb-1">
            {totalPages}
          </div>
          <div className="text-sm text-muted-foreground">Páginas Disponíveis</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">24h</div>
          <div className="text-sm text-muted-foreground">Atendimento Rápido</div>
        </div>
      </div>
    </div>
  );
};

export default FlipbookProductViewer;