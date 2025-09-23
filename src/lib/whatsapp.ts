const DEFAULT_MESSAGE =
  "Olá! Tenho interesse em seus produtos. Poderia me enviar mais informações?";

export function getWhatsAppNumber(): string {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER as
    | string
    | "+5511999999999";
  return number?.replace(/\D/g, "");
}

export function createWhatsAppUrl(params?: { message?: string }) {
  const number = getWhatsAppNumber();
  const base = number ? `https://wa.me/${number}` : "https://wa.me";
  const message = params?.message ?? DEFAULT_MESSAGE;
  const search = message ? `?text=${encodeURIComponent(message)}` : "";
  return `${base}${search}`;
}

export function createProductWhatsAppUrl(productName: string) {
  const message = `Olá! Tenho interesse no produto "${productName}". Poderia me enviar mais informações?`;
  return createWhatsAppUrl({ message });
}

export function createCartWhatsAppUrl(cartItems: Array<{ product: { name: string; price: number | string }; quantity: number }>) {
  if (cartItems.length === 0) {
    return createWhatsAppUrl();
  }

  let message = "🛒 *Pedido via Carrinho Virtual*\n\n";
  
  cartItems.forEach((item, index) => {
    const price = typeof item.product.price === 'string' 
      ? item.product.price 
      : `R$ ${item.product.price.toFixed(2).replace('.', ',')}`;
    
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   Quantidade: ${item.quantity}\n`;
    message += `   Preço: ${price}\n\n`;
  });

  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.product.price === 'string' 
      ? parseFloat(item.product.price.replace(/[^\d,]/g, '').replace(',', '.'))
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  message += `💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
  message += "Gostaria de finalizar este pedido. Poderia me informar sobre formas de pagamento e entrega?";

  return createWhatsAppUrl({ message });
}
