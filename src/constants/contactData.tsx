import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import type { ContactCardProps } from "@/components/ContactCard";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export const getContactCardsData = (
  whatsappNumber: string,
): ContactCardProps[] => [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    content: (
      <>
        <p className="text-muted-foreground mb-4">
          Atendimento rápido e personalizado via WhatsApp
        </p>
        <WhatsAppButton className="w-full sm:w-auto px-6 py-2">
          Iniciar Conversa
        </WhatsAppButton>
      </>
    ),
  },
  {
    icon: Phone,
    title: "Telefone",
    content: (
      <p className="text-muted-foreground">
        {whatsappNumber
          ? `${whatsappNumber.replace(/(\d{2})?(\d{2})(\d{5})(\d{4})/, "($2) $3-$4")}`
          : "(11) 99999-9999"}
      </p>
    ),
  },
  {
    icon: Mail,
    title: "E-mail",
    content: (
      <p className="text-muted-foreground">serenacosmeticos@hotmail.com</p>
    ),
  },
];

export const getAdditionalCardsData = (): ContactCardProps[] => [
  {
    icon: Clock,
    title: "Horário de Atendimento",
    content: (
      <div className="space-y-1 text-muted-foreground">
        <p>Segunda a Sexta: 8h às 18h</p>
        <p>Sábado: 8h às 14h</p>
        <p>Domingo: Plantão via WhatsApp</p>
      </div>
    ),
  },
  {
    icon: MapPin,
    title: "Localização",
    content: (
      <p className="text-muted-foreground">
        Av. Sorocaba, 961, Pq João Ramalho
        <br />
        Santo André - SP
        <br />
        Atendimento presencial sob agendamento
      </p>
    ),
  },
];
