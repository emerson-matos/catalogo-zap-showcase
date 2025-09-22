import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortOption, SortDirection } from "@/hooks/useProductsQuery";

interface Props {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onChange: (sortBy: SortOption, sortDirection: SortDirection) => void;
}

const sortOptions = [
  { value: 'name', label: 'Nome' },
  { value: 'price', label: 'Preço' },
  { value: 'category', label: 'Categoria' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'newest', label: 'Mais Recentes' },
] as const;

export const ProductSort = ({ sortBy, sortDirection, onChange }: Props) => {
  const handleSortChange = (newSortBy: SortOption) => {
    const newDirection = newSortBy === sortBy && sortDirection === 'asc' ? 'desc' : 'asc';
    onChange(newSortBy, newDirection);
  };

  const toggleDirection = () => {
    onChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
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
      <Button variant="outline" size="sm" onClick={toggleDirection} className="px-2">
        {getSortIcon()}
      </Button>
    </div>
  );
};