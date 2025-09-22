// Re-export Supabase types for backward compatibility
export type { Product } from '@/lib/supabase';

export interface ProductCategory {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly description?: string;
  readonly image?: string;
  readonly isActive: boolean;
}

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
  readonly addedAt: string;
}

export interface CartContextType {
  readonly items: readonly CartItem[];
  readonly addItem: (product: Product, quantity?: number) => void;
  readonly removeItem: (productId: string) => void;
  readonly updateQuantity: (productId: string, quantity: number) => void;
  readonly clearCart: () => void;
  readonly getTotalItems: () => number;
  readonly getTotalPrice: () => number;
  readonly getItemQuantity: (productId: string) => number;
  readonly isInCart: (productId: string) => boolean;
}

export interface ProductFilters {
  readonly category?: string;
  readonly priceRange?: {
    readonly min: number;
    readonly max: number;
  };
  readonly rating?: number;
  readonly isNew?: boolean;
  readonly search?: string;
}

export interface ProductSortOptions {
  readonly field: 'name' | 'price' | 'rating' | 'created_at';
  readonly order: 'asc' | 'desc';
}

export interface ProductCardProps {
  readonly product: Product;
  readonly onAddToCart?: (product: Product) => void;
  readonly onWhatsApp?: (product: Product) => void;
  readonly className?: string;
}

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  { 
    id: 'all', 
    name: 'Todos', 
    label: 'Todos os Produtos',
    description: 'Todos os produtos disponíveis',
    isActive: true 
  },
  { 
    id: 'electronics', 
    name: 'Eletrônicos', 
    label: 'Eletrônicos',
    description: 'Produtos eletrônicos e tecnológicos',
    isActive: true 
  },
  { 
    id: 'cosmetics', 
    name: 'Cosméticos', 
    label: 'Cosméticos',
    description: 'Produtos de beleza e cosméticos',
    isActive: true 
  },
  { 
    id: 'beverages', 
    name: 'Bebidas', 
    label: 'Bebidas',
    description: 'Bebidas e líquidos',
    isActive: true 
  },
] as const;

export type ProductCategoryId = typeof PRODUCT_CATEGORIES[number]['id'];