import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
}

export const CategoryFilters = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  isLoading 
}: CategoryFiltersProps) => {
  if (isLoading) {
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
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="transition-all duration-300"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};