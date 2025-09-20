import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PriceRangeFilter } from "@/components/ui/price-range-filter";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  priceRange: [number, number];
  minRating: number;
  showNewOnly: boolean;
  showInStock: boolean;
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  priceRange: [number, number];
  className?: string;
}

export const AdvancedFilters = React.forwardRef<HTMLDivElement, AdvancedFiltersProps>(
  ({ isOpen, onToggle, filters, onFiltersChange, priceRange, className }, ref) => {
    const handleFilterChange = (key: keyof FilterOptions, value: any) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    };

    const clearFilters = () => {
      onFiltersChange({
        priceRange: priceRange,
        minRating: 0,
        showNewOnly: false,
        showInStock: false,
      });
    };

    const hasActiveFilters = 
      filters.minRating > 0 || 
      filters.showNewOnly || 
      filters.showInStock ||
      filters.priceRange[0] !== priceRange[0] ||
      filters.priceRange[1] !== priceRange[1];

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onToggle}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros Avançados
            {hasActiveFilters && (
              <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {isOpen && (
          <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
            <PriceRangeFilter
              value={filters.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
              min={priceRange[0]}
              max={priceRange[1]}
            />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Avaliação Mínima</Label>
              <div className="flex gap-2">
                {[0, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.minRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('minRating', rating)}
                  >
                    {rating === 0 ? "Todas" : `${rating}+ ⭐`}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-only"
                  checked={filters.showNewOnly}
                  onCheckedChange={(checked) => 
                    handleFilterChange('showNewOnly', checked)
                  }
                />
                <Label htmlFor="new-only" className="text-sm">
                  Apenas produtos novos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.showInStock}
                  onCheckedChange={(checked) => 
                    handleFilterChange('showInStock', checked)
                  }
                />
                <Label htmlFor="in-stock" className="text-sm">
                  Apenas produtos em estoque
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AdvancedFilters.displayName = "AdvancedFilters";