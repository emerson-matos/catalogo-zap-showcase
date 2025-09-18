import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { Star } from 'lucide-react';
import { formatPriceBRL } from '@/lib/utils';
import type { Product } from '@/types/product';
import './Flipbook.css';

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
    <div className={`flipbook-page ${isLeftPage ? 'left-page' : 'right-page'}`}>
      <div className="page-content">
        {pageProducts.map((product, index) => (
          <div key={product.id} className={`product-spot ${isLeftPage ? 'left-product' : 'right-product'}`}>
            <div className="product-image-container">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              {product.isNew && (
                <Badge className="product-badge new-badge">
                  Novo
                </Badge>
              )}
              <Badge className="product-badge category-badge">
                {product.category}
              </Badge>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-details">
                <div className="price-rating">
                  <span className="product-price">{formatPriceBRL(product.price)}</span>
                  {product.rating && (
                    <div className="product-rating">
                      <Star className="star-icon" />
                      <span>{product.rating}</span>
                    </div>
                  )}
                </div>
                
                <WhatsAppButton
                  product={product}
                  className="whatsapp-button"
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
    <div className="flipbook-container">
      <div className="flipbook-header">
        <h1 className="flipbook-title">Catálogo de Produtos</h1>
        <p className="flipbook-subtitle">Navegue pelas páginas do nosso catálogo</p>
      </div>

      <div className="flipbook-wrapper">
        <div 
          ref={flipbookRef}
          className={`flipbook ${isFlipping ? 'flipping' : ''}`}
        >
          <div className="flipbook-pages">
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

        <div className="flipbook-controls">
          <Button
            variant="outline"
            size="lg"
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="control-button prev-button"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </Button>

          <div className="page-indicator">
            <span className="page-numbers">
              {currentPage + 1} de {totalPages}
            </span>
            <div className="page-dots">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`page-dot ${index === currentPage ? 'active' : ''}`}
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
            className="control-button next-button"
          >
            Próxima
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flipbook-footer">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFlipbook}
            className="reset-button"
          >
            <RotateCcw className="w-4 h-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};