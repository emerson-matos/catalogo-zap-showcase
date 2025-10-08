"use client";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchInput } from "@/components/ui/search-input";
import { SortSelect } from "@/components/ui/sort-select";
import { FilterPanel } from "@/components/ui/filter-panel";
import { CategoryFilters } from "@/components/CategoryFilters";
import { AlertTriangle, RefreshCw, Filter, FunnelIcon } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useProductSort } from "@/hooks/useProductSort";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useId } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

interface ProductGridProps {
  // Layout
  showStatistics?: boolean;
}

export const ProductGrid = ({ showStatistics = true }: ProductGridProps) => {
  const sectionId = useId();

  // Main data query
  const { products, isLoading, isFetching, error, isError, refetch, isEmpty } =
    useProductsQuery();

  const {
    searchQuery,
    setSearchQuery,
    filteredProducts: searchResults,
  } = useProductSearch(products);

  // Filter functionality
  const {
    filters,
    setFilters,
    priceRange,
    filteredProducts: filterResults,
  } = useProductFilters(searchResults);

  // Sort functionality
  const { sortOption, setSortOption, sortedProducts } =
    useProductSort(filterResults);

  return (
    <section id={sectionId} className="text-foreground">
      <div className="container mx-auto px-4">
        {/* Error State */}
        {isError && error && (
          <Alert className="mb-8 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Erro ao carregar produtos: {error}</span>
              {refetch && (
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
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {isEmpty && !isLoading && (
          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Oops, nenhum Produto encontrado.
            </AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <section>
          <div className="flex items-center m-auto p-3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Pesquisar produtos..."
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Filtros <FunnelIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  maxPrice={priceRange.max}
                  minPrice={priceRange.min}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center align-middle justify-between mb-8">
            <CategoryFilters
              selectedCategory={filters.category}
              onCategoryChange={(category) =>
                setFilters({ ...filters, category })
              }
              isLoading={isLoading}
            />

            {/* Controls */}
            <SortSelect value={sortOption} onValueChange={setSortOption} />

            {/* Results Count */}
            {!isLoading && (
              <div className="text-sm text-muted-foreground">
                {sortedProducts.length} de {products.length} produtos
                encontrados
              </div>
            )}
          </div>

          {/* Filters */}
        </section>

        <Separator className="my-4" />
        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Products */}
          <div
            className="lg:col-span-4"
          >
            {!isLoading && sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {products.length === 0 &&
                    "Tente ajustar os filtros ou termos de pesquisa."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))
                  : sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {showStatistics && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {products.length}+
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
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
