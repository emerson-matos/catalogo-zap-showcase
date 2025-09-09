import { MessageCircle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { createProductWhatsAppUrl, createWhatsAppUrl } from "@/lib/whatsapp";

export const WhatsAppButton = ({
  children,
  className,
  asChild,
  size,
  variant,
  product,
}: ButtonProps & { product?: Product }) => {
  const whatsappUrl = product
    ? createProductWhatsAppUrl(product.name)
    : createWhatsAppUrl();
  return (
    <Button
      asChild={asChild}
      onClick={() => window.open(whatsappUrl, "_blank")}
      size={size ?? "icon"}
      variant={variant}
      className={cn(
        "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-hover transition-colors",
        className,
      )}
    >
      <MessageCircle className="min-h-4 min-w-4" />
      {children}
    </Button>
  );
};
