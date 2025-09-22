import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchInput } from "@/components/ui/search-input";
import { SortSelect } from "@/components/ui/sort-select";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import { AlertTriangle, RefreshCw, Wifi, SortAsc } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useState } from "react";

const ProductGrid = ({ sectionId }: { sectionId: string }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    priceRange,
    totalProducts,
    filteredProductsCount,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    isEmpty,
    isStale,
    hasSearch,
    hasActiveFilters,
    clearFilters,
  } = useProductsQuery();

  const sortOptions = [
    { value: "name-asc", label: "Nome (A-Z)", icon: <SortAsc className="h-4 w-4" /> },
    { value: "name-desc", label: "Nome (Z-A)", icon: <SortAsc className="h-4 w-4 rotate-180" /> },
    { value: "price-asc", label: "Menor Preço", icon: <SortAsc className="h-4 w-4" /> },
    { value: "price-desc", label: "Maior Preço", icon: <SortAsc className="h-4 w-4 rotate-180" /> },
    { value: "rating-desc", label: "Melhor Avaliação", icon: <SortAsc className="h-4 w-4" /> },
    { value: "category-asc", label: "Categoria", icon: <SortAsc className="h-4 w-4" /> },
  ];

  return (
    <section id={sectionId} className="py-20 text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-4xl font-bold text-primary">Nossos Produtos</h2>
            {isFetching && !isLoading && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {isStale && (
              <Wifi
                className="h-4 w-4 text-yellow-500"
                title="Dados podem estar desatualizados"
              />
            )}
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosa de produtos de alta qualidade
          </p>
        </div>

        {/* Error State */}
        {isError && error && (
          <Alert className="mb-8 border-destructive bg-destructive/10">
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
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <SortSelect
                value={sortBy}
                onValueChange={setSortBy}
                options={sortOptions}
                placeholder="Ordenar por..."
              />
              
              <AdvancedFilters
                isOpen={showAdvancedFilters}
                onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
                filters={filters}
                onFiltersChange={setFilters}
                priceRange={priceRange}
              />
            </div>

            {/* Results Counter */}
            <div className="text-sm text-muted-foreground">
              {hasSearch || hasActiveFilters ? (
                <span>
                  {filteredProductsCount} de {totalProducts} produtos
                </span>
              ) : (
                <span>{totalProducts} produtos disponíveis</span>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))
            : categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-300"
                  disabled={isFetching && isLoading}
                >
                  {category}
                </Button>
              ))}
        </div>

        {/* No Results Message */}
        {!isLoading && products.length === 0 && (hasSearch || hasActiveFilters) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar seus filtros ou termos de pesquisa
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                clearFilters();
                setSelectedCategory("Todos");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {hasSearch || hasActiveFilters ? filteredProductsCount : totalProducts}+
            </div>
            <div className="text-muted-foreground">
              {hasSearch || hasActiveFilters ? "Produtos Encontrados" : "Produtos Disponíveis"}
            </div>
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
