import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SortOption } from "@/hooks/useProductSort";

interface AdminSortProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  totalProducts: number;
}

const sortOptions = [
  { value: 'name-asc', label: 'Nome (A-Z)', icon: ArrowUp },
  { value: 'name-desc', label: 'Nome (Z-A)', icon: ArrowDown },
  { value: 'price-asc', label: 'Preço (menor)', icon: ArrowUp },
  { value: 'price-desc', label: 'Preço (maior)', icon: ArrowDown },
] as const;

export const AdminSort = ({ sortOption, setSortOption, totalProducts }: AdminSortProps) => {

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Ordenação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <OptionIcon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground">
            {totalProducts} produto{totalProducts !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};