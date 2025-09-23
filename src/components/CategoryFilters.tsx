import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoriesQuery } from "@/hooks/useCategoryQuery";
import { useId } from "react";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
}

export const CategoryFilters = ({
  selectedCategory,
  onCategoryChange,
  isLoading,
}: CategoryFiltersProps) => {
  const { data } = useCategoriesQuery();
  const todosId = useId();
  if (isLoading || !data) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        key={todosId}
        variant={selectedCategory === "Todos" ? "default" : "outline"}
        onClick={() => onCategoryChange("Todos")}
        className="transition-all duration-300"
      >
        Todos
      </Button>
      {data.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className="transition-all duration-300"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

