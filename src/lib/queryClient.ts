import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import { toast } from 'sonner';

// Enhanced error handling
const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('NetworkError') ||
    error.name === 'NetworkError'
  );
};

const isClientError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('400') ||
    error.message.includes('401') ||
    error.message.includes('403') ||
    error.message.includes('404') ||
    error.message.includes('422')
  );
};

const isServerError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('500') ||
    error.message.includes('502') ||
    error.message.includes('503') ||
    error.message.includes('504')
  );
};

// Create a singleton query client with advanced configuration
export const createQueryClient = () => new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handling for queries
      console.error('Query failed:', { error, query: query.queryKey });
      
      // Only show error toast for queries that are being actively used
      if (query.getObserversCount() > 0) {
        if (isNetworkError(error)) {
          toast.error('Erro de conexão. Verificando sua internet...', {
            id: 'network-error',
            duration: 5000,
          });
        } else if (isServerError(error)) {
          toast.error('Servidor temporariamente indisponível. Tentando novamente...', {
            id: 'server-error',
            duration: 5000,
          });
        } else if (!isClientError(error)) {
          // Don't show toast for client errors (they should be handled specifically)
          toast.error('Erro ao carregar dados. Tente novamente.', {
            duration: 4000,
          });
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // Global error handling for mutations
      console.error('Mutation failed:', error);
      
      if (isNetworkError(error)) {
        toast.error('Erro de conexão. Verifique sua internet.', {
          duration: 5000,
        });
      } else if (isServerError(error)) {
        toast.error('Erro no servidor. Tente novamente em alguns instantes.', {
          duration: 5000,
        });
      } else {
        toast.error('Operação falhou. Tente novamente.', {
          duration: 4000,
        });
      }
    },
    onSuccess: (data, variables, context, mutation) => {
      // Global success handling for mutations
      const mutationKey = mutation.options.mutationKey;
      
      // Show success toast for specific operations
      if (mutationKey?.includes('create')) {
        toast.success('Criado com sucesso!', { duration: 3000 });
      } else if (mutationKey?.includes('update')) {
        toast.success('Atualizado com sucesso!', { duration: 3000 });
      } else if (mutationKey?.includes('delete')) {
        toast.success('Removido com sucesso!', { duration: 3000 });
      }
    },
  }),
  defaultOptions: {
    queries: {
      // Stale time based on data volatility
      staleTime: 5 * 60 * 1000, // 5 minutes for most data
      // Garbage collection time
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Advanced retry logic
      retry: (failureCount, error) => {
        // Don't retry client errors
        if (isClientError(error)) {
          return false;
        }
        
        // Retry network and server errors up to 3 times
        if (isNetworkError(error) || isServerError(error)) {
          return failureCount < 3;
        }
        
        // Default retry for other errors
        return failureCount < 2;
      },
      // Exponential backoff with jitter
      retryDelay: (attemptIndex, error) => {
        const baseDelay = 1000;
        const exponentialDelay = baseDelay * Math.pow(2, attemptIndex);
        const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd
        const maxDelay = isNetworkError(error) ? 10000 : 30000;
        
        return Math.min(exponentialDelay + jitter, maxDelay);
      },
      // Smart refetch on window focus
      refetchOnWindowFocus: (query) => {
        // Only refetch if data is stale and query is being observed
        return query.state.isStale && query.getObserversCount() > 0;
      },
      // Refetch when coming back online
      refetchOnReconnect: true,
      // Network mode for better offline handling
      networkMode: 'online',
      // No background refetch by default - let specific queries opt in
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      // Enhanced mutation retry logic
      retry: (failureCount, error) => {
        // Don't retry client errors for mutations
        if (isClientError(error)) {
          return false;
        }
        
        // Retry network errors once for mutations
        if (isNetworkError(error)) {
          return failureCount < 1;
        }
        
        // Don't retry server errors for mutations by default
        return false;
      },
      // Mutation retry delay
      retryDelay: 2000,
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

// Enhanced query key factories with TypeScript support
export const queryKeys = {
  // Products domain
  products: {
    // Base key for all product queries
    all: ['products'] as const,
    
    // List queries
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    
    // Detail queries
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    
    // Data source specific queries
    sheets: (filters?: ProductFilters) => [...queryKeys.products.list(filters), 'sheets'] as const,
    supabase: (filters?: ProductFilters) => [...queryKeys.products.list(filters), 'supabase'] as const,
    
    // Category-based queries (combined from both versions)
    categories: {
      all: () => [...queryKeys.products.all, 'categories'] as const,
      list: () => [...queryKeys.products.categories.all(), 'list'] as const,
      byCategory: (category: string, filters?: ProductFilters) => 
        [...queryKeys.products.list(filters), 'category', category] as const,
    },
    
    // Legacy support for main branch patterns
    byCategory: (category: string) =>
      [...queryKeys.products.all, "category", category] as const,
    byCategoryId: (categoryId: string) =>
      [...queryKeys.products.all, "categoryId", categoryId] as const,
    byId: (id: string) => [...queryKeys.products.all, "id", id] as const,
    
    // Search queries
    search: (query: string, filters?: ProductFilters) => 
      [...queryKeys.products.list(filters), 'search', query] as const,
    
    // Statistics and analytics
    stats: () => [...queryKeys.products.all, 'stats'] as const,
    popularProducts: (limit: number = 10) => 
      [...queryKeys.products.stats(), 'popular', limit] as const,
  },
  
  // Categories domain (from main branch)
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
    byId: (id: string) => [...queryKeys.categories.all, "id", id] as const,
  },
  
  // Authentication domain
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    role: (userId: string) => [...queryKeys.auth.all, 'role', userId] as const,
    permissions: (userId: string) => [...queryKeys.auth.all, 'permissions', userId] as const,
  },
  
  // Configuration domain
  config: {
    all: ['config'] as const,
    app: () => [...queryKeys.config.all, 'app'] as const,
    features: () => [...queryKeys.config.all, 'features'] as const,
  },
  
  // Cart domain (if we want to sync cart state)
  cart: {
    all: ['cart'] as const,
    items: (userId?: string) => [...queryKeys.cart.all, 'items', userId || 'anonymous'] as const,
  },
} as const;

// Type definitions for better TypeScript support
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  rating?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Utility functions for query key management
export const queryKeyUtils = {
  // Invalidate all queries for a specific domain
  invalidateProductQueries: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.products.all,
    });
  },
  
  // Invalidate specific product queries
  invalidateProductList: (queryClient: QueryClient, filters?: ProductFilters) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.products.list(filters),
    });
  },
  
  // Remove specific product from cache
  removeProductFromCache: (queryClient: QueryClient, productId: string) => {
    return queryClient.removeQueries({
      queryKey: queryKeys.products.detail(productId),
    });
  },
  
  // Prefetch popular products
  prefetchPopularProducts: (queryClient: QueryClient, fetcher: () => Promise<unknown>) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.products.popularProducts(),
      queryFn: fetcher,
      staleTime: 15 * 60 * 1000, // 15 minutes for popular products
    });
  },
  
  // Get cached product data
  getCachedProduct: (queryClient: QueryClient, productId: string) => {
    return queryClient.getQueryData(queryKeys.products.detail(productId));
  },
  
  // Set product data in cache (useful for optimistic updates)
  setProductInCache: (queryClient: QueryClient, productId: string, data: unknown) => {
    return queryClient.setQueryData(queryKeys.products.detail(productId), data);
  },
  
  // Update product in all relevant caches
  updateProductInCaches: (queryClient: QueryClient, productId: string, updater: (old: unknown) => unknown) => {
    // Update detail cache
    queryClient.setQueryData(
      queryKeys.products.detail(productId),
      updater
    );
    
    // Update list caches that might contain this product
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.lists(),
      type: 'active',
    });
  },
} as const;