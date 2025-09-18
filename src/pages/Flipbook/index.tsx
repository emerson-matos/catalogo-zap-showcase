import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Flipbook } from '@/components/flipbook/Flipbook';
import { useProductsQuery } from '@/hooks/useProductsQuery';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const FlipbookPage: React.FC = () => {
  const {
    products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isEmpty,
  } = useProductsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
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
        </div>
        <Footer />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nenhum produto encontrado para exibir no catálogo.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Flipbook products={products} />
      </main>
      <Footer />
    </div>
  );
};

export { FlipbookPage };