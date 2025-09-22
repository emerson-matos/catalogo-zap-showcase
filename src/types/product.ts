// Re-export Supabase types for backward compatibility
export type { Product } from '@/lib/supabase'

// Legacy interface for backward compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  label: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'all', name: 'Todos', label: 'Todos' },
  { id: 'electronics', name: 'Eletrônicos', label: 'Eletrônicos' },
  { id: 'cosmetics', name: 'Cosméticos', label: 'Cosméticos' },
  { id: 'beverages', name: 'Bebidas', label: 'Bebidas' },
] as const;
