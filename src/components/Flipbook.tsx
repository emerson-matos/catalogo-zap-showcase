import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import FlipbookCard from "./FlipbookCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import type { Product } from "@/types/product";

interface FlipbookProps {
  sectionId: string;
}

const Flipbook = ({ sectionId }: FlipbookProps) => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    isEmpty,
  } = useProductsQuery();

  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Calculate pages - each page shows 2 products (left and right)
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

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  return (
    <section id={sectionId} className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold">Catálogo de Produtos</h2>
            {isFetching && !isLoading && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Navegue pelo nosso catálogo como um livro digital e descubra nossos produtos
          </p>
        </div>

        {/* Error State */}
        {isError && error && (
          <Alert className="mb-8 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Erro ao carregar produtos: {error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Tentar Novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {isEmpty && !isLoading && (
          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nenhum produto encontrado. Verifique a configuração da planilha.
            </AlertDescription>
          </Alert>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))
          ) : (
            categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-300"
                disabled={isFetching && isLoading}
              >
                {category}
              </Button>
            ))
          )}
        </div>

        {/* Flipbook Container */}
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="space-y-4">
                <Skeleton className="h-[600px] w-[800px] rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Book spine */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 transform -translate-x-1/2 z-10 shadow-lg"></div>
              
              {/* Pages container */}
              <div className={`
                flex justify-center gap-4 transition-all duration-500 ease-in-out
                ${isFlipping ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
              `}>
                {/* Left page */}
                {currentProducts[0] && (
                  <div className="flex-1 max-w-md">
                    <FlipbookCard
                      product={currentProducts[0]}
                      isLeftPage={true}
                      pageNumber={currentPage * 2 + 1}
                      totalPages={totalPages * 2}
                    />
                  </div>
                )}

                {/* Right page */}
                {currentProducts[1] && (
                  <div className="flex-1 max-w-md">
                    <FlipbookCard
                      product={currentProducts[1]}
                      isRightPage={true}
                      pageNumber={currentPage * 2 + 2}
                      totalPages={totalPages * 2}
                    />
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || isFlipping}
                  className="gap-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Página Anterior
                </Button>

                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1 || isFlipping}
                  className="gap-2"
                >
                  Próxima Página
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Page indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (index !== currentPage && !isFlipping) {
                        setIsFlipping(true);
                        setTimeout(() => {
                          setCurrentPage(index);
                          setIsFlipping(false);
                        }, 300);
                      }
                    }}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-200
                      ${index === currentPage 
                        ? 'bg-primary scale-125' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }
                    `}
                    disabled={isFlipping}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {products.length}+
            </div>
            <div className="text-muted-foreground">Produtos Disponíveis</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-muted-foreground">Clientes Satisfeitos</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">24h</div>
            <div className="text-muted-foreground">Atendimento Rápido</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Flipbook;