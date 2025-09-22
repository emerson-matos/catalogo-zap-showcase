import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/hooks/useProductSort";

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  placeholder?: string;
  className?: string;
}

export const SortSelect = React.forwardRef<HTMLButtonElement, SortSelectProps>(
  ({ value, onValueChange, options, placeholder = "Ordenar por...", className }, ref) => {
    const selectedOption = options.find(option => option.value === value);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn("justify-between min-w-[180px]", className)}
          >
            <div className="flex items-center gap-2">
              {selectedOption?.icon}
              <span>{selectedOption?.label || placeholder}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onValueChange(option.value)}
              className="flex items-center gap-2"
            >
              {option.icon}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

SortSelect.displayName = "SortSelect";