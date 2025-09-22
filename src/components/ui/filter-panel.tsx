import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { ProductFilters } from "@/hooks/useProductFilters";

interface FilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  maxPrice: number;
  minPrice: number;
}

export const FilterPanel = ({ filters, onFiltersChange, maxPrice, minPrice }: FilterPanelProps) => {
  const hasActiveFilters = 
    filters.priceRange[0] !== minPrice || 
    filters.priceRange[1] !== maxPrice ||
    filters.minRating > 0 ||
    filters.showNewOnly;

  const resetFilters = () => {
    onFiltersChange({
      ...filters,
      priceRange: [minPrice, maxPrice],
      minRating: 0,
      showNewOnly: false,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Ativo
              </Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Faixa de Preço</h4>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })}
              min={minPrice}
              max={maxPrice}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>R$ {filters.priceRange[0].toFixed(2)}</span>
              <span>R$ {filters.priceRange[1].toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Avaliação Mínima</h4>
          <div className="px-2">
            <Slider
              value={[filters.minRating]}
              onValueChange={(value) => onFiltersChange({ ...filters, minRating: value[0] })}
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-2 text-center">
              {filters.minRating > 0 ? `${filters.minRating} estrelas ou mais` : 'Qualquer avaliação'}
            </div>
          </div>
        </div>

        {/* Checkbox Filters */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Outros Filtros</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-only"
                checked={filters.showNewOnly}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, showNewOnly: !!checked })}
              />
              <label htmlFor="new-only" className="text-sm font-medium">
                Apenas produtos novos
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};