import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const ProductSearch = ({ value, onChange }: Props) => (
  <div className="relative w-full max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <Input
      type="text"
      placeholder="Pesquisar produtos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 pr-10"
    />
    {value && (
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        onClick={() => onChange('')}
      >
        <X className="h-3 w-3" />
      </Button>
    )}
  </div>
);