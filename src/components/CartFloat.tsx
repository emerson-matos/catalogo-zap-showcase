import { useState } from "react";
import { ShoppingCart, X, Plus, Minus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatPriceBRL } from "@/lib/utils";
import { createCartWhatsAppUrl } from "@/lib/whatsapp";

export function CartFloat() {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppCheckout = () => {
    const whatsappUrl = createCartWhatsAppUrl(items);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <ShoppingCart className="h-6 w-6" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {getTotalItems()}
          </div>
        </Button>
      ) : (
        <Card className="w-80 max-h-96 shadow-lg border border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Carrinho ({getTotalItems()})
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="max-h-48 overflow-y-auto space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={item.product.images?.[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPriceBRL(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
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
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-primary">
                  {formatPriceBRL(getTotalPrice())}
                </span>
              </div>

              <Button
                onClick={handleWhatsAppCheckout}
                className="w-full justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                size="default"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Finalizar Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
