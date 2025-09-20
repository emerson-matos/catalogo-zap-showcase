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
    return createWhatsAppUrl({ message: "Olá! Gostaria de fazer um pedido." });
  }

  const itemsList = cartItems
    .map(item => {
      const price = typeof item.product.price === 'string' 
        ? item.product.price 
        : `R$ ${item.product.price.toFixed(2).replace('.', ',')}`;
      return `• ${item.product.name} - ${price} x${item.quantity}`;
    })
    .join('\n');

  const totalPrice = cartItems.reduce((total, item) => {
    const price = typeof item.product.price === 'string' 
      ? parseFloat(item.product.price.replace(/[^\d.,]/g, '').replace(',', '.'))
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const totalFormatted = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

  const message = `🛒 *Pedido via Site*

Olá! Gostaria de fazer o seguinte pedido:

${itemsList}

*Total: ${totalFormatted}*

Poderia confirmar a disponibilidade e me informar sobre formas de pagamento e entrega?`;
  
  return createWhatsAppUrl({ message });
}
