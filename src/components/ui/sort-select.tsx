import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortOption = {
  value: string;
  label: string;
  direction?: 'asc' | 'desc';
};

export const SORT_OPTIONS: SortOption[] = [
  { value: 'name-asc', label: 'Nome (A-Z)', direction: 'asc' },
  { value: 'name-desc', label: 'Nome (Z-A)', direction: 'desc' },
  { value: 'price-asc', label: 'Menor Preço', direction: 'asc' },
  { value: 'price-desc', label: 'Maior Preço', direction: 'desc' },
  { value: 'category-asc', label: 'Categoria (A-Z)', direction: 'asc' },
  { value: 'category-desc', label: 'Categoria (Z-A)', direction: 'desc' },
  { value: 'rating-desc', label: 'Melhor Avaliação', direction: 'desc' },
  { value: 'rating-asc', label: 'Pior Avaliação', direction: 'asc' },
];

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const SortSelect = React.forwardRef<HTMLButtonElement, SortSelectProps>(
  ({ value, onValueChange, className }, ref) => {
    const selectedOption = SORT_OPTIONS.find(option => option.value === value);
    const isAscending = selectedOption?.direction === 'asc';
    const isDescending = selectedOption?.direction === 'desc';

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger ref={ref} className="w-[200px]">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Ordenar por..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.direction === 'asc' && <ArrowUp className="h-3 w-3" />}
                  {option.direction === 'desc' && <ArrowDown className="h-3 w-3" />}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

SortSelect.displayName = "SortSelect";