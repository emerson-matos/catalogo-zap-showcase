const DEFAULT_MESSAGE =
  "Olá! Tenho interesse em seus produtos. Poderia me enviar mais informações?";

export function getWhatsAppNumber(): string | undefined {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
  return number?.replace(/\D/g, "");
}

export function createWhatsAppUrl(params?: {
  message?: string;
  numberOverride?: string;
}) {
  const number = params?.numberOverride ?? getWhatsAppNumber() ?? "";
  const base = number ? `https://wa.me/${number}` : "https://wa.me";
  const message = params?.message ?? DEFAULT_MESSAGE;
  const search = message ? `?text=${encodeURIComponent(message)}` : "";
  return `${base}${search}`;
}

export function createProductWhatsAppUrl(productName: string) {
  const message = `Olá! Tenho interesse no produto "${productName}". Poderia me enviar mais informações?`;
  return createWhatsAppUrl({ message });
}
