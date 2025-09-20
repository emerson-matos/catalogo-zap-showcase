import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  priceRange: [number, number];
  minRating: number;
  showNewOnly: boolean;
  showInStock: boolean;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  maxPrice: number;
  minPrice: number;
  className?: string;
}

export const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  ({ filters, onFiltersChange, maxPrice, minPrice, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePriceRangeChange = (value: number[]) => {
      onFiltersChange({
        ...filters,
        priceRange: [value[0], value[1]],
      });
    };

    const handleMinRatingChange = (value: number[]) => {
      onFiltersChange({
        ...filters,
        minRating: value[0],
      });
    };

    const handleToggleNewOnly = (checked: boolean) => {
      onFiltersChange({
        ...filters,
        showNewOnly: checked,
      });
    };

    const handleToggleInStock = (checked: boolean) => {
      onFiltersChange({
        ...filters,
        showInStock: checked,
      });
    };

    const resetFilters = () => {
      onFiltersChange({
        priceRange: [minPrice, maxPrice],
        minRating: 0,
        showNewOnly: false,
        showInStock: false,
      });
    };

    const hasActiveFilters = 
      filters.priceRange[0] !== minPrice || 
      filters.priceRange[1] !== maxPrice ||
      filters.minRating > 0 ||
      filters.showNewOnly ||
      filters.showInStock;

    return (
      <Card ref={ref} className={cn("w-full", className)}>
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
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={cn("space-y-6", !isOpen && "hidden md:block")}>
          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Faixa de Preço</h4>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
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
                onValueChange={handleMinRatingChange}
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
                  onCheckedChange={handleToggleNewOnly}
                />
                <label
                  htmlFor="new-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apenas produtos novos
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.showInStock}
                  onCheckedChange={handleToggleInStock}
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apenas produtos em estoque
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FilterPanel.displayName = "FilterPanel";