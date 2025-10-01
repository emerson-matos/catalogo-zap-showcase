// Re-export Supabase types for backward compatibility
import type { Product } from '@/lib/supabase'


export type { Product }
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
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
