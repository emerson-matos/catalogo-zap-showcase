import { QueryClient } from "@tanstack/react-query";

// Create a singleton query client with optimized defaults
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 5 minutes before considering stale
        staleTime: 5 * 60 * 1000,
        // Keep in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed requests 3 times
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error instanceof Error && error.message.includes("4")) {
            return false;
          }
          return failureCount < 3;
        },
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        // Refetch when coming back online
        refetchOnReconnect: true,
        // Background refetch every 10 minutes
        refetchInterval: 10 * 60 * 1000,
        // Don't refetch in background tabs
        refetchIntervalInBackground: false,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        // Shorter retry delay for mutations
        retryDelay: 1000,
      },
    },
  });

// Query key factories for consistent cache management
export const queryKeys = {
  products: {
    all: ["products"] as const,
    sheets: () => [...queryKeys.products.all, "sheets"] as const,
    supabase: () => [...queryKeys.products.all, "supabase"] as const,
    categories: () => [...queryKeys.products.all, "categories"] as const,
    byCategory: (category: string) =>
      [...queryKeys.products.all, "category", category] as const,
    byCategoryId: (categoryId: string) =>
      [...queryKeys.products.all, "categoryId", categoryId] as const,
    byId: (id: string) => [...queryKeys.products.all, "id", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
    byId: (id: string) => [...queryKeys.categories.all, "id", id] as const,
  },
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    role: (userId: string) => [...queryKeys.auth.all, "role", userId] as const,
  },
} as const;

