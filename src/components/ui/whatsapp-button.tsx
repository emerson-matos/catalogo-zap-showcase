import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  message,
}: React.ComponentProps<typeof Button> & { product?: Product; message?: string }) => {
  const whatsappUrl = product
    ? createProductWhatsAppUrl(product.name)
    : createWhatsAppUrl({ message });

  const isIconOnly = !children || size === "icon";

  // Define base colors based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case "ghost":
        return "bg-transparent hover:bg-green-300/10 hover:text-accent-foreground";
      case "outline":
        return "border-accent hover:bg-green-300 hover:text-accent-foreground";
      default:
        return "bg-accent text-accent-foreground hover:bg-green-300/90 hover:text-accent-foreground";
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
        <MessageCircle className="size-4" />
      ) : (
        <>
          <MessageCircle className="size-4 shrink-0" />
          <span className="shrink-0">{children}</span>
        </>
      )}
    </Button>
  );
};
