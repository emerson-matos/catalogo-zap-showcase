import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

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
        "bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200",
        isIconOnly && size === "icon" ? "p-2" : "min-w-fit whitespace-nowrap",
        className,
      )}
    >
      {isIconOnly ? (
        <Plus className="h-4 w-4" />
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2 shrink-0" />
          <span className="shrink-0">{children}</span>
        </>
      )}
    </Button>
  );
};

