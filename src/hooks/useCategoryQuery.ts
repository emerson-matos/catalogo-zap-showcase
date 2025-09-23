import { useQuery } from "@tanstack/react-query";
import { SupabaseService } from "@/lib/supabaseService";
import { queryKeys } from "@/lib/queryClient";

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: SupabaseService.getCategories,
  });
};

// Hook for getting a single category by ID
export const useCategoryQuery = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.categories.byId(categoryId),
    queryFn: () => SupabaseService.getCategoryById(categoryId),
    enabled: !!categoryId,
  });
};
