import React, { useState, useEffect } from "react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

const Flipbook: React.FC = () => {
  const { data: products = [], isLoading, error } = useProductsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Organizar produtos em páginas (2 produtos por página)
  const productsPerPage = 2;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // Muda página a cada 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlay, totalPages]);

  const handleNextPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
      setIsFlipping(false);
    }, 300);
  };

  const handlePrevPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
      setIsFlipping(false);
    }, 300);
  };

  const handlePageClick = (pageIndex: number) => {
    if (isFlipping || pageIndex === currentPage) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsFlipping(false);
    }, 300);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar produtos</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Controles do Flipbook */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={isFlipping}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-4">
          <Button
            variant={isAutoPlay ? "default" : "outline"}
            onClick={toggleAutoPlay}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {isAutoPlay ? "Parar" : "Auto"}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={isFlipping}
          className="flex items-center gap-2"
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Área do Flipbook */}
      <div className="relative flipbook-page">
        <div
          className={`transition-all duration-300 ${
            isFlipping ? "opacity-0 scale-95 flipping" : "opacity-100 scale-100"
          }`}
        >
          <Card className="flipbook-container border-0 min-h-[600px]">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                {currentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`flipbook-product-card ${
                      index === 0 ? "md:border-r md:pr-8" : "md:pl-8"
                    }`}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Indicadores de Página */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            disabled={isFlipping}
            className={`w-3 h-3 rounded-full flipbook-indicator ${
              index === currentPage
                ? "bg-primary scale-125"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Flipbook;