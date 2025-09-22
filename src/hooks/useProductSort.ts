import { useState, useMemo } from 'react';
import type { Product } from '@/types/product';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const parsePrice = (price: number | string): number => {
  if (typeof price === 'number') return price;
  const parsed = parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

export const useProductSort = (products: Product[]) => {
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    sorted.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc':
          return parsePrice(b.price) - parsePrice(a.price);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, sortOption]);

  return {
    sortOption,
    setSortOption,
    sortedProducts,
  };
};