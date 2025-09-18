import FlipbookProductCard from "@/components/FlipbookProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Wifi, BookOpen } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";

const FlipbookGrid = ({ sectionId }: { sectionId: string }) => {
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

  return (
    <section id={sectionId} className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Catálogo de Produtos
            </h2>
            {isFetching && !isLoading && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {isStale && (
              <Wifi className="h-4 w-4 text-yellow-500" title="Dados podem estar desatualizados" />
            )}
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Explore nossa coleção completa de produtos com estilo flipbook interativo
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Clique nos produtos para ver mais detalhes
          </div>
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
                className="transition-all duration-300 hover:scale-105"
                disabled={isFetching && isLoading}
              >
                {category}
              </Button>
            ))
          )}
        </div>

        {/* Flipbook Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <FlipbookProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
            <div className="text-4xl font-bold text-primary mb-2">
              {totalProducts}+
            </div>
            <div className="text-muted-foreground">Produtos Disponíveis</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-accent/10 to-transparent rounded-lg border border-accent/20">
            <div className="text-4xl font-bold text-accent mb-2">1000+</div>
            <div className="text-muted-foreground">Clientes Satisfeitos</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
            <div className="text-4xl font-bold text-primary mb-2">24h</div>
            <div className="text-muted-foreground">Atendimento Rápido</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlipbookGrid;