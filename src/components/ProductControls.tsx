import { ProductSearch } from "./ProductSearch";
import { ProductSort } from "./ProductSort";
import { ProductFilters } from "./ProductFilters";
import type { ProductFilters as ProductFiltersType, SortOption, SortDirection } from "@/hooks/useProductsQuery";

interface Props {
  filters: ProductFiltersType;
  onFiltersChange: (filters: Partial<ProductFiltersType>) => void;
  onResetFilters: () => void;
  setSearch: (search: string) => void;
  setSorting: (sortBy: SortOption, sortDirection: SortDirection) => void;
  categories: string[];
  hasActiveFilters: boolean;
  totalProducts: number;
  filteredCount: number;
}

export const ProductControls = ({
  filters,
  onFiltersChange,
  onResetFilters,
  setSearch,
  setSorting,
  categories,
  hasActiveFilters,
  totalProducts,
  filteredCount
}: Props) => (
  <div className="space-y-6 mb-8">
    {/* Search and Sort Row */}
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <ProductSearch value={filters.search} onChange={setSearch} />
      <ProductSort 
        sortBy={filters.sortBy} 
        sortDirection={filters.sortDirection} 
        onChange={setSorting} 
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
          <span>Mostrando {filteredCount} de {totalProducts} produtos</span>
        ) : (
          <span>{totalProducts} produtos disponíveis</span>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="text-xs">Filtros ativos aplicados</div>
      )}
    </div>
  </div>
);