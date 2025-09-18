import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Wifi, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import FlipbookProductCard from "@/components/FlipbookProductCard";

const Flipbook = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    totalProducts,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    isEmpty,
    isStale,
  } = useProductsQuery();

  const [currentPage, setCurrentPage] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  // Produtos por página (2 produtos por página no flipbook)
  const productsPerPage = 2;
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Produtos da página atual
  const currentProducts = useMemo(() => {
    const startIndex = currentPage * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  }, [products, currentPage, productsPerPage]);

  const handleCardFlip = (productId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setFlippedCards(new Set()); // Reset flipped cards when changing pages
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setFlippedCards(new Set()); // Reset flipped cards when changing pages
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setFlippedCards(new Set()); // Reset flipped cards when changing pages
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Catálogo de Produtos</h1>
                <p className="text-muted-foreground">Navegue pelos nossos produtos como um catálogo</p>
              </div>
            </div>
            
            {isFetching && !isLoading && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {isStale && (
              <Wifi className="h-4 w-4 text-yellow-500" title="Dados podem estar desatualizados" />
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))
          ) : (
            categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(0); // Reset to first page when changing category
                  setFlippedCards(new Set()); // Reset flipped cards
                }}
                className="transition-all duration-300"
                disabled={isFetching && isLoading}
              >
                {category}
              </Button>
            ))
          )}
        </div>

        {/* Flipbook Content */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-[500px] w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              {/* Products Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {currentProducts.map((product) => (
                  <FlipbookProductCard
                    key={product.id}
                    product={product}
                    isFlipped={flippedCards.has(product.id)}
                    onFlip={() => handleCardFlip(product.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(i)}
                        className="w-10 h-10"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center gap-2"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Page Info */}
              <div className="text-center text-muted-foreground">
                Página {currentPage + 1} de {totalPages} • {products.length} produtos encontrados
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="text-4xl font-bold text-primary mb-2">
              {totalProducts}+
            </div>
            <div className="text-muted-foreground">Produtos Disponíveis</div>
          </div>
          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-muted-foreground">Clientes Satisfeitos</div>
          </div>
          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="text-4xl font-bold text-primary mb-2">24h</div>
            <div className="text-muted-foreground">Atendimento Rápido</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flipbook;