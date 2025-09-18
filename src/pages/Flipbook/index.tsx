import { useState, useEffect } from "react";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FlipbookCard from "@/components/FlipbookCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export const FlipbookPage = () => {
  const { data: products = [], isLoading, error } = useProductsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const productsPerPage = 2; // Mostrar 2 produtos por página
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleReset = () => {
    setCurrentPage(0);
    setIsFlipping(false);
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, isFlipping]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive">Erro ao carregar produtos</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="pt-20">
        {/* Seção Hero do Flipbook */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Catálogo Digital
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Navegue pelos nossos produtos como em um catálogo real
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>← → Navegar</span>
              <span>Espaço Próxima página</span>
              <span>Home Voltar ao início</span>
            </div>
          </div>
        </section>

        {/* Flipbook Container */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Controles de navegação */}
              <div className="flex justify-between items-center mb-8">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || isFlipping}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </Button>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Início
                  </Button>
                </div>

                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1 || isFlipping}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  Próxima
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Área do Flipbook */}
              <div className="relative">
                <div
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ease-in-out",
                    isFlipping && flipDirection === 'next' && "transform translate-x-full opacity-0",
                    isFlipping && flipDirection === 'prev' && "transform -translate-x-full opacity-0"
                  )}
                >
                  {currentProducts.map((product, index) => (
                    <FlipbookCard
                      key={`${product.id}-${currentPage}`}
                      product={product}
                      pageNumber={currentPage * productsPerPage + index + 1}
                      isFlipping={isFlipping}
                    />
                  ))}
                </div>

                {/* Efeito de página virada */}
                {isFlipping && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={cn(
                      "w-full h-full bg-gradient-to-r from-primary/10 to-transparent",
                      flipDirection === 'next' ? "animate-slide-right" : "animate-slide-left"
                    )} />
                  </div>
                )}
              </div>

              {/* Indicadores de página */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i !== currentPage && !isFlipping) {
                        setFlipDirection(i > currentPage ? 'next' : 'prev');
                        setIsFlipping(true);
                        setTimeout(() => {
                          setCurrentPage(i);
                          setIsFlipping(false);
                        }, 300);
                      }
                    }}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-200",
                      i === currentPage
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Contact sectionId="contato" />
      </main>
      
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};