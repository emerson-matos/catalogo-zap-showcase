import React from "react";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { formatPriceBRL } from "@/lib/utils";
import { createCartWhatsAppUrl } from "@/lib/whatsapp";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const handleCheckout = () => {
    const whatsappUrl = createCartWhatsAppUrl(items);
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Carrinho</h2>
            {getTotalItems() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getTotalItems()}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione produtos para começar
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 border border-border rounded-lg"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatPriceBRL(item.product.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total ({getTotalItems()} itens)
                  </span>
                  <span className="text-lg font-bold">
                    {formatPriceBRL(getTotalPrice())}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-whatsapp hover:bg-whatsapp-hover text-whatsapp-foreground"
                  >
                    Finalizar Pedido via WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full"
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

