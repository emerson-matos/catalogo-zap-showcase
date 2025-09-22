import { useState, useMemo } from 'react';
import type { Product } from '@/lib/supabase';

export interface ProductFilters {
  searchQuery: string;
  selectedCategory: string;
  showNewOnly: boolean;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  filteredProducts: Product[];
  categories: string[];
  updateSearchQuery: (query: string) => void;
  updateCategory: (category: string) => void;
  toggleNewOnly: () => void;
  clearFilters: () => void;
}

export const useProductFilters = (products: Product[]): UseProductFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewOnly, setShowNewOnly] = useState(false);

  const filters: ProductFilters = {
    searchQuery,
    selectedCategory,
    showNewOnly,
  };

  // Filter products based on search, category, and new status
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesNew = !showNewOnly || product.is_new;
      
      return matchesSearch && matchesCategory && matchesNew;
    });
  }, [products, searchQuery, selectedCategory, showNewOnly]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map(p => p.category).filter(Boolean))
    ).sort();
    return ['all', ...uniqueCategories];
  }, [products]);

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  const updateCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const toggleNewOnly = () => {
    setShowNewOnly(prev => !prev);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setShowNewOnly(false);
  };

  return {
    filters,
    filteredProducts,
    categories,
    updateSearchQuery,
    updateCategory,
    toggleNewOnly,
    clearFilters,
  };
};