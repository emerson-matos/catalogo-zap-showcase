import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import FlipbookCard from "@/components/FlipbookCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, BookOpen, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const FlipbookPage = () => {
  const { products, isLoading, error, refetch, isEmpty } = useProductsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // Group products into pages (2 products per page for flipbook effect)
  const pages = useMemo(() => {
    const pagesArray = [];
    for (let i = 0; i < products.length; i += 2) {
      pagesArray.push(products.slice(i, i + 2));
    }
    return pagesArray;
  }, [products]);

  const totalPages = pages.length;
  const currentProducts = pages[currentPage] || [];

  const handleCardFlip = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setFlippedCards(new Set()); // Reset flipped cards when changing pages
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setFlippedCards(new Set()); // Reset flipped cards when changing pages
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setFlippedCards(new Set()); // Reset flipped cards when changing pages
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando catálogo...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground">Erro ao carregar produtos</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Catálogo vazio</h2>
            <p className="text-muted-foreground">Nenhum produto encontrado no momento.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        
        {/* Page Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Catálogo Flipbook
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore nossos produtos em um catálogo interativo. Clique nos produtos para ver mais detalhes!
            </p>
            <Badge variant="secondary" className="text-sm">
              {products.length} produtos • Página {currentPage + 1} de {totalPages}
            </Badge>
          </div>

          {/* Flipbook Content */}
          <div className="max-w-6xl mx-auto">
            {/* Navigation Controls */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentPage
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="gap-2"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {currentProducts.map((product, index) => (
                <div key={product.id} className="flex justify-center">
                  <FlipbookCard
                    product={product}
                    isFlipped={flippedCards.has(index)}
                    onFlip={() => handleCardFlip(index)}
                  />
                </div>
              ))}
            </div>

            {/* Page Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Página {currentPage + 1} de {totalPages}
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFlippedCards(new Set())}
                  className="text-xs"
                >
                  Resetar cartões
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <WhatsAppFloat />
      </div>
    </ErrorBoundary>
  );
};

export default FlipbookPage;