import {
  BookOpen,
  MessageCircle,
  Package,
  Users,
  VideoIcon,
} from "lucide-react";

import type { NavigationCardProps } from "@/components/NavigationCard";

export const navigationCardsData: NavigationCardProps[] = [
  {
    title: "Sobre Nós",
    description: "Conheça nossa história, valores e o que nos torna únicos no mercado de cosméticos.",
    icon: Users,
    buttonText: "Saiba Mais",
    to: "/about",
  },
  {
    title: "Produtos",
    description: "Explore nossa linha completa de produtos cosméticos de qualidade.",
    icon: Package,
    buttonText: "Ver Produtos",
    to: "/products",
  },
  {
    title: "Catálogo",
    description: "Navegue pelos nossos produtos em um formato interativo de livro.",
    icon: BookOpen,
    buttonText: "Ver Catálogo",
    to: "/flipbook",
  },
  {
    title: "Contato",
    description: "Entre em contato conosco. Estamos aqui para ajudar com suas necessidades.",
    icon: MessageCircle,
    buttonText: "Falar Conosco",
    to: "/contact",
  },
  {
    title: "Vídeos",
    description: "Dicas de maquiagem",
    icon: VideoIcon,
    buttonText: "Ver vídeo",
    dialogContent: (
      <video controls autoPlay className="w-full rounded-lg">
        <source src="/meu-video.mp4" type="video/mp4" />
        <track kind="captions" srcLang="pt" label="Português" />
        Seu navegador não suporta o player de vídeo.
      </video>
    ),
  },
];
