import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';
import { formatPriceBRL } from '@/lib/utils';
import { useProductsQuery } from '@/hooks/useProductsQuery';
import type { Product } from '@/types/product';

const Flipbook = () => {
  const { products, isLoading } = useProductsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipbookRef = useRef<HTMLDivElement>(null);

  // Produtos por página (2 produtos por página)
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

  // Navegação por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, isFlipping]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg text-muted-foreground">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header da página */}
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Catálogo de Produtos
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Navegue pelo nosso catálogo interativo e descubra nossos produtos
        </p>
        
        {/* Indicador de página */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </span>
        </div>
      </div>

      {/* Flipbook Container */}
      <div className="container mx-auto px-4 pb-20">
        <div 
          ref={flipbookRef}
          className={`relative max-w-4xl mx-auto ${isFlipping ? 'flip-animation' : ''}`}
        >
          {/* Página do flipbook */}
          <Card className="flipbook-page shadow-2xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Cabeçalho da página */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">SeRena Cosméticos</h2>
                    <p className="text-muted-foreground">Distribuidora de Cosméticos do ABC Paulista</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Página</div>
                    <div className="text-2xl font-bold text-primary">{currentPage + 1}</div>
                  </div>
                </div>
              </div>

              {/* Conteúdo da página */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentProducts.map((product, index) => (
                    <div key={product.id} className="product-item">
                      <div className="relative group">
                        {/* Imagem do produto */}
                        <div className="relative overflow-hidden rounded-lg mb-4 shadow-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                          {product.isNew && (
                            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-accent to-accent/90 text-black dark:text-white font-bold shadow-lg">
                              Novo
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold shadow-md"
                          >
                            {product.category}
                          </Badge>
                        </div>

                        {/* Informações do produto */}
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                              {formatPriceBRL(product.price)}
                            </span>
                            {product.rating && (
                              <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
                                <Star className="w-4 h-4 fill-accent text-accent" />
                                <span className="text-sm font-medium">{product.rating}</span>
                              </div>
                            )}
                          </div>

                          <WhatsAppButton
                            product={product}
                            className="w-full justify-center gap-2 h-10 text-sm font-medium"
                            size="sm"
                          >
                            Consultar Produto
                          </WhatsAppButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Espaço vazio se não houver produtos suficientes */}
                {currentProducts.length < productsPerPage && (
                  <div className="flex items-center justify-center h-48 text-muted-foreground">
                    <div className="text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Fim do catálogo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Rodapé da página */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 border-t border-primary/20">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>SeRena Cosméticos - ABC Paulista</div>
                  <div>WhatsApp: (11) 99999-9999</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles de navegação */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevPage}
            disabled={currentPage === 0 || isFlipping}
            className="gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Anterior
          </Button>

          {/* Indicadores de página */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={index === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageClick(index)}
                disabled={isFlipping}
                className="w-10 h-10 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="gap-2"
          >
            Próxima
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Instruções */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Use as setas do teclado ← → para navegar ou clique nos botões</p>
        </div>
      </div>

      <style jsx>{`
        .flipbook-page {
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
        }

        .flip-animation .flipbook-page {
          transform: rotateY(-5deg) scale(0.98);
        }

        .product-item {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .flipbook-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .dark .flipbook-page {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Flipbook;