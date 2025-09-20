import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatPriceBRL } from '@/lib/utils';
import { createCartCheckoutWhatsAppUrl } from '@/lib/whatsapp';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;

    const cartItems = items.map((item: any) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: formatPriceBRL(item.product.price)
    }));

    const whatsappUrl = createCartCheckoutWhatsAppUrl(cartItems, formatPriceBRL(getTotalPrice()));
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Cart Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-whatsapp hover:bg-whatsapp-hover text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        <ShoppingCart className="h-6 w-6" />
        {getTotalItems() > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center"
          >
            {getTotalItems()}
          </Badge>
        )}
      </Button>

      {/* Cart Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">
                Carrinho ({getTotalItems()} itens)
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Seu carrinho está vazio</p>
                  <p className="text-sm">Adicione produtos para começar</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item: any) => (
                      <div key={item.product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e: any) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatPriceBRL(item.product.price)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
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
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-bold text-primary">
                        {formatPriceBRL(getTotalPrice())}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="flex-1"
                        disabled={items.length === 0}
                      >
                        Limpar Carrinho
                      </Button>
                      
                      <Button
                        onClick={handleCheckout}
                        className="flex-1 bg-whatsapp hover:bg-whatsapp-hover text-white"
                        disabled={items.length === 0}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Finalizar Pedido
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Cart;