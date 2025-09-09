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
  
  const isIconOnly = !children || size === "icon";
  
  return (
    <Button
      asChild={asChild}
      onClick={() => window.open(whatsappUrl, "_blank")}
      size={size ?? "icon"}
      variant={variant}
      className={cn(
        "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-hover transition-all duration-200",
        isIconOnly ? "p-2" : "px-4 py-2",
        className,
      )}
    >
      {isIconOnly ? (
        <MessageCircle className="h-4 w-4" />
      ) : (
        <>
          <MessageCircle className="h-4 w-4 mr-2" />
          {children}
        </>
      )}
    </Button>
  );
};
