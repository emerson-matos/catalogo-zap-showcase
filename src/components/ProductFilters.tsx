import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import type { ProductFilters } from "@/hooks/useProductsQuery";

interface Props {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  onResetFilters: () => void;
  categories: string[];
  hasActiveFilters: boolean;
}

export const ProductFilters = ({ filters, onFiltersChange, onResetFilters, categories, hasActiveFilters }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avançados
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">!</span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filters.category === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFiltersChange({ category })}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>Faixa de Preço</Label>
              <div className="space-y-2">
                <Slider
                  value={[filters.minPrice || 0, filters.maxPrice || 1000]}
                  onValueChange={([min, max]) => onFiltersChange({ minPrice: min, maxPrice: max })}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>R$ {filters.minPrice || 0}</span>
                  <span>R$ {filters.maxPrice || 1000}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <Label>Avaliação Mínima</Label>
              <div className="space-y-2">
                <Slider
                  value={[filters.minRating || 0]}
                  onValueChange={([rating]) => onFiltersChange({ minRating: rating })}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0 estrelas</span>
                  <span>{filters.minRating || 0} estrelas</span>
                  <span>5 estrelas</span>
                </div>
              </div>
            </div>

            {/* New Products Only */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-only"
                checked={filters.showNewOnly}
                onCheckedChange={(checked) => onFiltersChange({ showNewOnly: checked as boolean })}
              />
              <Label htmlFor="new-only">Apenas produtos novos</Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};