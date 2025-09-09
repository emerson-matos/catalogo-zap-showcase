import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const WhatsAppFloat = () => {
  const whatsappUrl = createWhatsAppUrl();

  return (
    <div className="fixed size-12 bottom-6 right-6 z-50">
      <WhatsAppButton size="icon"/>
    </div>
  );
};

export default WhatsAppFloat;

