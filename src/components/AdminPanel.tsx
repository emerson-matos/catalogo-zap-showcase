import { Loader2, PencilIcon, Filter } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAuth } from "@/hooks/useAuth";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useProductSort } from "@/hooks/useProductSort";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductCard from "./ProductCard";
import { SearchInput } from "./ui/search-input";
import { SortSelect } from "./ui/sort-select";
import { FilterPanel } from "./ui/filter-panel";
import { CategoryFilters } from "./CategoryFilters";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const AdminPanel = () => {
  const { user } = useAuth();
  const { products, isLoading } = useProductsQuery();
  const [showFilters, setShowFilters] = useState(false);

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo, {user?.email}
              </p>
            </div>
            <Button asChild>
              <Link to="/admin/products">
                <PencilIcon className="size-4" />
                cadastrar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto mb-6">
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Buscar produtos por nome ou descrição..."
            />
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
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
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
          <div className="text-center text-sm text-muted-foreground mb-8">
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

          {/* Products */}
          <div
            className={`lg:col-span-3 ${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}
          >
            {!isLoading && sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {products.length === 0 
                    ? "Nenhum produto cadastrado ainda." 
                    : "Tente ajustar os filtros ou termos de pesquisa."}
                </p>
                {products.length === 0 && (
                  <Button asChild>
                    <Link to="/admin/products">
                      <PencilIcon className="size-4 mr-2" />
                      Cadastrar primeiro produto
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
