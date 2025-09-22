import React from 'react';
import { Search, Eye, EyeOff, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRODUCT_CATEGORIES, VIEW_MODES, FORM_LABELS } from '@/constants/admin';
import type { ViewMode } from '@/constants/admin';

interface SearchAndFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  showNewOnly: boolean;
  viewMode: ViewMode;
  categories: string[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onToggleNewOnly: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = React.memo(({
  searchQuery,
  selectedCategory,
  showNewOnly,
  viewMode,
  categories,
  onSearchChange,
  onCategoryChange,
  onToggleNewOnly,
  onViewModeChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={FORM_LABELS.SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Todas' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showNewOnly ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleNewOnly}
            >
              {showNewOnly ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              Novos
            </Button>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === VIEW_MODES.GRID ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange(VIEW_MODES.GRID)}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === VIEW_MODES.LIST ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange(VIEW_MODES.LIST)}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});