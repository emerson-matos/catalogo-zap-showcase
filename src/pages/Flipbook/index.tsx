import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useProductSort } from "@/hooks/useProductSort";
import { useProductFilters } from "@/hooks/useProductFilters";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SearchInput } from "@/components/ui/search-input";
import { SortSelect } from "@/components/ui/sort-select";
import { FilterPanel } from "@/components/ui/filter-panel";
import Flipbook from "@/components/Flipbook";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Filter, RefreshCw } from "lucide-react";
import { useState } from "react";

export const FlipbookPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  const { products, isLoading, error, refetch, isFetching } = useProductsQuery();

  // Search functionality
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

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Carregando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h2 className="text-2xl font-bold mb-2 text-destructive">
          Erro ao carregar produtos
        </h2>
        <p className="text-muted-foreground mb-4">Tente recarregar a página</p>
        <Button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 m-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-4xl font-bold">
              Revista Digital de Produtos
            </h2>
            {isFetching && !isLoading && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-10 text-lg text-muted-foreground max-w-2xl mx-auto p-4 m-2">
          <p>
            Navegue pelos nossos produtos em um formato interativo de livro. Use
            as setas do teclado ou os botões para virar as páginas.
          </p>
          <br />
          <p>Arraste para visualizar</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="container mx-auto px-4 mb-8">
        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto mb-6">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>

          <CategoryFilters
            selectedCategory={filters.category}
            onCategoryChange={(category) =>
              setFilters({ ...filters, category })
            }
            isLoading={isLoading}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <SortSelect value={sortOption} onValueChange={setSortOption} />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="text-center text-sm text-muted-foreground mb-6">
            {sortedProducts.length} de {products.length} produtos encontrados
          </div>
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div
            className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              maxPrice={priceRange.max}
              minPrice={priceRange.min}
            />
          </div>

          {/* Flipbook */}
          <div
            className={`lg:col-span-3 ${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}
          >
            {!isLoading && sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros ou termos de pesquisa
                </p>
              </div>
            ) : (
              <Flipbook products={sortedProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
