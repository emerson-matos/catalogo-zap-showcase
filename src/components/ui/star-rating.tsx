import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
}

export const StarRating = ({
  value,
  onChange,
  max = 5,
  className,
}: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(value);

  const handleStarClick = (starIndex: number) => {
    const newValue = starIndex + 1;
    onChange(newValue);
  };

  const handleStarHover = (starIndex: number) => {
    setHoverValue(starIndex + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleMouseLeave}
          className="transition-colors hover:scale-110"
        >
          <Star
            className={cn(
              "size-6",
              i < displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200",
            )}
          />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(0)}
        className="ml-2 text-sm text-gray-500 hover:text-gray-700"
      >
        Limpar
      </button>
    </div>
  );
};
