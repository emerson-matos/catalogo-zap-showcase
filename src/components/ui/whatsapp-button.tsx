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

  // Define base colors based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case "ghost":
        return "bg-transparent text-accent hover:bg-accent/10 hover:text-accent";
      case "outline":
        return "border-accent text-accent hover:bg-accent hover:text-accent-foreground";
      default:
        return "bg-accent text-accent-foreground hover:bg-accent/90";
    }
  };

  return (
    <Button
      asChild={asChild}
      onClick={() => window.open(whatsappUrl, "_blank")}
      size={size ?? "default"}
      variant={variant}
      className={cn(
        getVariantClasses(),
        "transition-all duration-200",
        isIconOnly && size === "icon" ? "p-2" : "min-w-fit whitespace-nowrap",
        className,
      )}
    >
      {isIconOnly ? (
        <MessageCircle className="h-4 w-4" />
      ) : (
        <>
          <MessageCircle className="h-4 w-4 mr-2 shrink-0" />
          <span className="shrink-0">{children}</span>
        </>
      )}
    </Button>
  );
};
