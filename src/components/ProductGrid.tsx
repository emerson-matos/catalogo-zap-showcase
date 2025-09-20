import ProductCard from "@/components/ProductCard";
import { ProductControls } from "@/components/ProductControls";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";

const ProductGrid = ({ sectionId }: { sectionId: string }) => {
  const {
    products,
    categories,
    totalProducts,
    filteredProductsCount,
    filters,
    updateFilters,
    resetFilters,
    setSearchTerm,
    setSorting,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    isEmpty,
    isStale,
    hasActiveFilters,
  } = useProductsQuery();

  return (
    <section id={sectionId} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-4xl font-bold">Nossos Produtos</h2>
            {isFetching && !isLoading && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {isStale && (
              <Wifi className="h-4 w-4 text-yellow-500" title="Dados podem estar desatualizados" />
            )}
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosa de produtos de alta qualidade
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

        {/* Product Controls */}
        {!isLoading && (
          <ProductControls
            searchTerm={filters.searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
            onSortChange={setSorting}
            filters={filters}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            categories={categories}
            hasActiveFilters={hasActiveFilters}
            totalProducts={totalProducts}
            filteredProductsCount={filteredProductsCount}
          />
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))
          ) : (
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {totalProducts}+
            </div>
            <div className="text-muted-foreground">Produtos Disponíveis</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {categories.length - 1}+
            </div>
            <div className="text-muted-foreground">Categorias</div>
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

export default ProductGrid;
