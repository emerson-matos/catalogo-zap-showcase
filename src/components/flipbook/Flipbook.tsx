import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { Star } from 'lucide-react';
import { formatPriceBRL } from '@/lib/utils';
import type { Product } from '@/types/product';

interface FlipbookProps {
  products: Product[];
}

interface FlipbookPageProps {
  products: Product[];
  pageNumber: number;
  isLeftPage: boolean;
}

const FlipbookPage: React.FC<FlipbookPageProps> = ({ products, pageNumber, isLeftPage }) => {
  const startIndex = pageNumber * 2;
  const pageProducts = products.slice(startIndex, startIndex + 2);

  return (
    <div className={`flex-1 bg-white relative overflow-hidden ${isLeftPage ? 'border-r border-gray-200' : 'border-l border-gray-200'} md:flex-1 flex-col md:flex-row`}>
      <div className="p-4 md:p-8 h-full flex flex-col gap-4 md:gap-8">
        {pageProducts.map((product, index) => (
          <div key={product.id} className={`flex-1 flex flex-col relative bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-white ${isLeftPage ? 'mr-2 md:mr-4' : 'ml-2 md:ml-4'}`}>
            <div className="relative w-full h-32 md:h-48 rounded-lg overflow-hidden mb-3 md:mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              {product.isNew && (
                <Badge className="absolute top-2 md:top-3 left-2 md:left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold text-xs px-2 py-1 rounded shadow-lg">
                  Novo
                </Badge>
              )}
              <Badge className="absolute top-2 md:top-3 right-2 md:right-3 bg-white/90 text-gray-700 font-semibold text-xs px-2 py-1 rounded shadow-md border border-gray-200">
                {product.category}
              </Badge>
            </div>
            
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-tight">{product.name}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3 md:mb-4 flex-1">{product.description}</p>
              
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg md:text-2xl font-bold text-green-600">{formatPriceBRL(product.price)}</span>
                  {product.rating && (
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <Star className="w-3 md:w-4 h-3 md:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs md:text-sm font-medium text-gray-900">{product.rating}</span>
                    </div>
                  )}
                </div>
                
                <WhatsAppButton
                  product={product}
                  className="w-full justify-center font-medium text-xs md:text-sm"
                  size="sm"
                >
                  Consultar
                </WhatsAppButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Flipbook: React.FC<FlipbookProps> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipbookRef = useRef<HTMLDivElement>(null);
  
  const totalPages = Math.ceil(products.length / 2);
  const maxPage = totalPages - 1;

  const nextPage = () => {
    if (currentPage < maxPage && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(prev => prev + 1);
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(prev => prev - 1);
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  const resetFlipbook = () => {
    setIsFlipping(true);
    setCurrentPage(0);
    setTimeout(() => setIsFlipping(false), 600);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, maxPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-4 md:py-8 px-2 md:px-4 flex flex-col items-center">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Catálogo de Produtos
        </h1>
        <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Navegue pelas páginas do nosso catálogo
        </p>
      </div>

      <div className="relative max-w-6xl w-full perspective-1000">
        <div 
          ref={flipbookRef}
          className={`relative w-full h-[400px] md:h-[600px] transform-gpu transition-transform duration-500 ease-in-out ${isFlipping ? '-rotate-y-5' : ''}`}
        >
          <div className="relative w-full h-full flex flex-col md:flex-row shadow-2xl rounded-lg overflow-hidden">
            <FlipbookPage 
              products={products} 
              pageNumber={currentPage} 
              isLeftPage={true}
            />
            <FlipbookPage 
              products={products} 
              pageNumber={currentPage} 
              isLeftPage={false}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 md:mt-8 px-2 md:px-4 gap-4 md:gap-0">
          <Button
            variant="outline"
            size="lg"
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full md:w-auto"
          >
            <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
            Anterior
          </Button>

          <div className="flex flex-col items-center gap-2">
            <span className="text-base md:text-lg font-medium text-gray-700">
              {currentPage + 1} de {totalPages}
            </span>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPage 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                  onClick={() => {
                    if (index !== currentPage && !isFlipping) {
                      setIsFlipping(true);
                      setCurrentPage(index);
                      setTimeout(() => setIsFlipping(false), 600);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={nextPage}
            disabled={currentPage === maxPage || isFlipping}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full md:w-auto"
          >
            Próxima
            <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
          </Button>
        </div>

        <div className="mt-4 md:mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFlipbook}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm"
          >
            <RotateCcw className="w-3 md:w-4 h-3 md:h-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};