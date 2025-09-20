import { ProductSearch } from "./ProductSearch";
import { ProductSort } from "./ProductSort";
import { ProductFilters } from "./ProductFilters";
import type { ProductFilters as ProductFiltersType, SortOption, SortDirection } from "@/hooks/useProductsQuery";

interface ProductControlsProps {
  // Search
  searchTerm: string;
  onSearchChange: (term: string) => void;
  
  // Sort
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, sortDirection: SortDirection) => void;
  
  // Filters
  filters: ProductFiltersType;
  onFiltersChange: (filters: Partial<ProductFiltersType>) => void;
  onResetFilters: () => void;
  categories: string[];
  hasActiveFilters: boolean;
  
  // Stats
  totalProducts: number;
  filteredProductsCount: number;
}

export const ProductControls = ({
  searchTerm,
  onSearchChange,
  sortBy,
  sortDirection,
  onSortChange,
  filters,
  onFiltersChange,
  onResetFilters,
  categories,
  hasActiveFilters,
  totalProducts,
  filteredProductsCount
}: ProductControlsProps) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <ProductSearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        <ProductSort
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={onSortChange}
        />
      </div>

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        onResetFilters={onResetFilters}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {hasActiveFilters ? (
            <span>
              Mostrando {filteredProductsCount} de {totalProducts} produtos
            </span>
          ) : (
            <span>{totalProducts} produtos disponíveis</span>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="text-xs">
            Filtros ativos aplicados
          </div>
        )}
      </div>
    </div>
  );
};