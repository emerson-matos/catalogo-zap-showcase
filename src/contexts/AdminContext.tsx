import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Product } from '@/lib/supabase';
import type { AdminContextType, AdminState, ProductFilters, BulkOperationState, ProductFormState } from '@/types/admin';

// Action types
type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_FILTERS'; payload: Partial<ProductFilters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SELECT_PRODUCT'; payload: string }
  | { type: 'SELECT_ALL'; payload: Product[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_BULK_DELETING'; payload: boolean }
  | { type: 'SET_EDITING_PRODUCT'; payload: Product | null }
  | { type: 'SET_IMAGE_PREVIEW'; payload: string };

// Initial state
const initialState: AdminState = {
  isLoading: false,
  error: null,
};

const initialFilters: ProductFilters = {
  searchQuery: '',
  selectedCategory: 'all',
  showNewOnly: false,
};

const initialBulkState: BulkOperationState = {
  selectedProducts: new Set(),
  showBulkActions: false,
  isBulkDeleting: false,
};

const initialFormState: ProductFormState = {
  editingProduct: null,
  imagePreview: '',
  isSubmitting: false,
};

// Reducer
const adminReducer = (
  state: AdminState,
  action: AdminAction
): AdminState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Provider
interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const [filters, setFilters] = React.useState<ProductFilters>(initialFilters);
  const [bulkState, setBulkState] = React.useState<BulkOperationState>(initialBulkState);
  const [formState, setFormState] = React.useState<ProductFormState>(initialFormState);

  const actions = {
    // Product actions
    createProduct: useCallback(async (data: any) => {
      // Implementation would go here
    }, []),
    updateProduct: useCallback(async (id: string, data: any) => {
      // Implementation would go here
    }, []),
    deleteProduct: useCallback(async (id: string) => {
      // Implementation would go here
    }, []),
    
    // Bulk actions
    bulkDelete: useCallback(async (ids: string[]) => {
      setBulkState(prev => ({ ...prev, isBulkDeleting: true }));
      try {
        // Implementation would go here
      } finally {
        setBulkState(prev => ({ ...prev, isBulkDeleting: false }));
      }
    }, []),
    exportProducts: useCallback((products: Product[]) => {
      // Implementation would go here
    }, []),
    
    // Filter actions
    updateFilters: useCallback((newFilters: Partial<ProductFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }, []),
    clearFilters: useCallback(() => {
      setFilters(initialFilters);
    }, []),
    
    // Selection actions
    selectProduct: useCallback((id: string) => {
      setBulkState(prev => {
        const newSelected = new Set(prev.selectedProducts);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        return {
          ...prev,
          selectedProducts: newSelected,
          showBulkActions: newSelected.size > 0,
        };
      });
    }, []),
    selectAll: useCallback((products: Product[]) => {
      setBulkState(prev => {
        if (prev.selectedProducts.size === products.length) {
          return {
            ...prev,
            selectedProducts: new Set(),
            showBulkActions: false,
          };
        } else {
          return {
            ...prev,
            selectedProducts: new Set(products.map(p => p.id)),
            showBulkActions: true,
          };
        }
      });
    }, []),
    clearSelection: useCallback(() => {
      setBulkState(prev => ({
        ...prev,
        selectedProducts: new Set(),
        showBulkActions: false,
      }));
    }, []),
  };

  const stats = {
    totalProducts: 0, // This would come from props or context
    filteredProducts: 0,
    newProducts: 0,
    categoriesCount: 0,
  };

  const contextValue: AdminContextType = {
    state,
    filters,
    bulkState,
    formState,
    stats,
    actions,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook
export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};