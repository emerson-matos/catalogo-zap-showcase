import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppFloat = () => {
  const whatsappMessage =
    "Olá! Tenho interesse em seus produtos. Poderia me enviar mais informações?";
  const whatsappNumber = "5511999999999"; // Substitua pelo número real
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="ghost"
        size="lg"
        className="rounded-full size-16 shadow-2xl hover:shadow-3xl animate-pulse hover:animate-none"
        onClick={() => window.open(whatsappUrl, "_blank")}
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="size-7" />
      </Button>
    </div>
  );
};

export default WhatsAppFloat;

