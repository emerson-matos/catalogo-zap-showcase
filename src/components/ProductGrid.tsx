import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchInput } from "@/components/ui/search-input";
import { SortSelect } from "@/components/ui/sort-select";
import { FilterPanel } from "@/components/ui/filter-panel";
import { AlertTriangle, RefreshCw, Wifi, Filter, Grid, List, Star } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useState } from "react";
import { formatPriceBRL } from "@/lib/utils";

const ProductGrid = ({ sectionId }: { sectionId: string }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    priceRange,
    totalProducts,
    filteredCount,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    isEmpty,
    isStale,
    hasFilteredResults,
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

        {/* Search and Controls */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Pesquisar produtos..."
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
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
                    className="transition-all duration-300"
                    disabled={isFetching && isLoading}
                  >
                    {category}
                  </Button>
                ))
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-3">
              <SortSelect
                value={sortOption}
                onValueChange={setSortOption}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {!isLoading && (
            <div className="text-center text-sm text-muted-foreground">
              {filteredCount === totalProducts ? (
                `${totalProducts} produtos encontrados`
              ) : (
                `${filteredCount} de ${totalProducts} produtos encontrados`
              )}
            </div>
          )}
        </div>

        {/* Filters Panel */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                maxPrice={priceRange.max}
                minPrice={priceRange.min}
              />
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  maxPrice={priceRange.max}
                  minPrice={priceRange.min}
                />
              </div>
            )}

            {/* Products Grid */}
            <div className={`lg:col-span-3 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>

              {/* No Results */}
              {!isLoading && !hasFilteredResults && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
                    <p className="text-sm">
                      Tente ajustar os filtros ou termos de pesquisa
                    </p>
                  </div>
                </div>
              )}

              {/* Products Grid/List */}
              {viewMode === 'grid' ? (
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
                    products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex gap-4 p-4 border rounded-lg">
                        <Skeleton className="h-24 w-24 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-8 w-32" />
                        </div>
                      </div>
                    ))
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-24 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <span className="text-xl font-bold text-primary">
                              {formatPriceBRL(product.price)}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {product.category}
                            </span>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-accent text-accent" />
                                <span className="text-sm font-medium">{product.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
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
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-muted-foreground">Clientes Satisfeitos</div>
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
