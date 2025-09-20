import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatPriceBRL } from "@/lib/utils";

interface PriceRangeFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
  className?: string;
}

export const PriceRangeFilter = React.forwardRef<HTMLDivElement, PriceRangeFilterProps>(
  ({ value, onChange, min, max, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <Label className="text-sm font-medium mb-3 block">
          Faixa de Preço
        </Label>
        <div className="space-y-4">
          <Slider
            value={value}
            onValueChange={onChange}
            min={min}
            max={max}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPriceBRL(value[0])}</span>
            <span>{formatPriceBRL(value[1])}</span>
          </div>
        </div>
      </div>
    );
  }
);

PriceRangeFilter.displayName = "PriceRangeFilter";