import { MessageCircle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const whatsappMessage =
  "Olá! Gostaria de entrar em contato para saber mais sobre seus produtos.";
const whatsappNumber = "5511999999999"; // Substitua pelo número real
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;
export const WhatsAppButton = ({ children, className, size }: ButtonProps) => {
  return (
    <Button
      onClick={() => window.open(whatsappUrl, "_blank")}
      size={size}
      className={cn(
        "h-full w-full min-h-6 min-w-6 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-hover transition-colors",
        className
      )}
    >
      <MessageCircle className="size-4" />
      {children}
    </Button>
  );
};
