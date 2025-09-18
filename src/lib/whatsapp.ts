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
