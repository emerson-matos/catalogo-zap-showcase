export const WHATSAPP_CONFIG = {
  number: '5511999999999', // Replace with real number
  messageTemplate: (productName: string) => 
    `Olá! Tenho interesse no produto "${productName}". Poderia me enviar mais informações?`,
} as const;

export const createWhatsAppUrl = (productName: string): string => {
  const message = WHATSAPP_CONFIG.messageTemplate(productName);
  return `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(message)}`;
};
