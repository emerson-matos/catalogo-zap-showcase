import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface CartIconProps {
  onClick: () => void;
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick, className }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("relative hover:bg-accent/10 transition-colors", className)}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
    </Button>
  );
};

