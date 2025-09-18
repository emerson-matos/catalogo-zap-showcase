import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import type { Product } from "@/types/product";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

interface FlipbookPageProps {
  products: Product[];
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  totalPages: number;
}

const FlipbookPage: React.FC<FlipbookPageProps> = ({
  products,
  currentPage,
  onNext,
  onPrev,
  totalPages,
}) => {
  const productsPerPage = 2;
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const pageProducts = products.slice(startIndex, endIndex);

  return (
    <div className="flipbook-page">
      <div className="page-content">
        {pageProducts.map((product, index) => (
          <div key={product.id} className={`product-spread ${index === 0 ? 'left-page' : 'right-page'}`}>
            <Card className="h-full bg-gradient-card shadow-card border-0 overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="relative flex-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-64 object-cover"
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
                  <h3 className="text-xl font-semibold mb-2 text-primary">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-1">
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
  );
};

export const Flipbook = () => {
  const { products, isLoading, error, isError } = useProductsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 2;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Reset to first page when products change
    setCurrentPage(0);
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">Carregando catálogo...</p>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg text-destructive">Erro ao carregar produtos</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Catálogo de Produtos</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Navegue pelo nosso catálogo como um livro digital
            </p>
          </div>

          {/* Flipbook Container */}
          <div className="flipbook-container">
            <div className="book-wrapper">
              <FlipbookPage
                products={products}
                currentPage={currentPage}
                onNext={handleNext}
                onPrev={handlePrev}
                totalPages={totalPages}
              />
            </div>

            {/* Navigation Controls */}
            <div className="flipbook-controls">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="flip-button"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Página Anterior
              </Button>

              <div className="page-indicator">
                <span className="text-sm text-muted-foreground">
                  Página {currentPage + 1} de {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="flip-button"
              >
                Próxima Página
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Page Numbers */}
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(i)}
                  className="page-number"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};