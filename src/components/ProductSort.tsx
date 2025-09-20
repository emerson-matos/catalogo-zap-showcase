import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortOption, SortDirection } from "@/hooks/useProductsQuery";

interface ProductSortProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, sortDirection: SortDirection) => void;
}

const sortOptions = [
  { value: 'name', label: 'Nome' },
  { value: 'price', label: 'Preço' },
  { value: 'category', label: 'Categoria' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'newest', label: 'Mais Recentes' },
];

export const ProductSort = ({ sortBy, sortDirection, onSortChange }: ProductSortProps) => {
  const handleSortChange = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      // Toggle direction if same option selected
      onSortChange(newSortBy, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for new option
      onSortChange(newSortBy, 'asc');
    }
  };

  const getSortIcon = () => {
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Ordenar por:</span>
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
        className="px-2"
      >
        {getSortIcon()}
      </Button>
    </div>
  );
};