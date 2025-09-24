import React from "react";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface AddToCartButtonProps extends React.ComponentProps<typeof Button> {
  product: Product;
}

export const AddToCartButton = ({
  children,
  className,
  asChild,
  size,
  variant,
  product,
}: AddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: "Clique no ícone do carrinho para ver seus itens",
    });
  };

  const isIconOnly = !children || size === "icon";

  return (
    <Button
      asChild={asChild}
      onClick={handleAddToCart}
      size={size ?? "default"}
      variant={variant}
      className={cn(
        "transition-all duration-200",
        isIconOnly && size === "icon" ? "p-2" : "min-w-fit whitespace-nowrap",
        className,
      )}
    >
      {isIconOnly ? (
        <Plus className="h-4 w-4" />
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2 shrink-0" />
          <span className="shrink-0">{children || "Adicionar"}</span>
        </>
      )}
    </Button>
  );
};

