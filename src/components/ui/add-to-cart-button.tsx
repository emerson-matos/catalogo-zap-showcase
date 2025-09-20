import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
  variant?: 'default' | 'icon' | 'compact';
  className?: string;
  children?: React.ReactNode;
}

export const AddToCartButton = ({
  product,
  variant = 'default',
  className,
  children,
  ...props
}: AddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleAddToCart}
        size="icon"
        variant="outline"
        className={cn(
          "bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200",
          className
        )}
        {...props}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleAddToCart}
        size="sm"
        variant="outline"
        className={cn(
          "bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200",
          className
        )}
        {...props}
      >
        <Plus className="h-4 w-4 mr-1" />
        Adicionar
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={cn(
        "bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200",
        className
      )}
      {...props}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {children || 'Adicionar ao Carrinho'}
    </Button>
  );
};