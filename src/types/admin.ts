import type { Product } from '@/lib/supabase';

export interface AdminState {
  isLoading: boolean;
  error: string | null;
}

export interface ProductFilters {
  searchQuery: string;
  selectedCategory: string;
  showNewOnly: boolean;
}

export interface BulkOperationState {
  selectedProducts: Set<string>;
  showBulkActions: boolean;
  isBulkDeleting: boolean;
}

export interface ProductFormState {
  editingProduct: Product | null;
  imagePreview: string;
  isSubmitting: boolean;
}

export interface AdminStats {
  totalProducts: number;
  filteredProducts: number;
  newProducts: number;
  categoriesCount: number;
}

export interface AdminActions {
  // Product actions
  createProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Bulk actions
  bulkDelete: (ids: string[]) => Promise<void>;
  exportProducts: (products: Product[]) => void;
  
  // Filter actions
  updateFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  
  // Selection actions
  selectProduct: (id: string) => void;
  selectAll: (products: Product[]) => void;
  clearSelection: () => void;
}

export interface AdminContextType {
  state: AdminState;
  filters: ProductFilters;
  bulkState: BulkOperationState;
  formState: ProductFormState;
  stats: AdminStats;
  actions: AdminActions;
}

export interface AdminPanelProps {
  className?: string;
  onError?: (error: Error) => void;
  onProductCreated?: (product: Product) => void;
  onProductUpdated?: (product: Product) => void;
  onProductDeleted?: (productId: string) => void;
}