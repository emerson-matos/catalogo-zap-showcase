import {
  BookOpen,
  FlaskConicalIcon,
  MessageCircle,
  Package,
  Users,
  VideoIcon,
} from "lucide-react";

import type { NavigationCardProps } from "@/components/NavigationCard";

export const navigationCardsData: NavigationCardProps[] = [
  {
    title: "Sobre Nós",
    description:
      "Conheça nossa história, valores e o que nos torna únicos no mercado de cosméticos.",
    icon: Users,
    buttonText: "Saiba Mais",
    to: "/about",
  },
  {
    title: "Produtos",
    description:
      "Explore nossa linha completa de produtos cosméticos de qualidade.",
    icon: Package,
    buttonText: "Ver Produtos",
    to: "/products",
  },
  {
    title: "Catálogo",
    description:
      "Navegue pelos nossos produtos em um formato interativo de livro.",
    icon: BookOpen,
    buttonText: "Ver Catálogo",
    to: "/flipbook",
  },
  {
    title: "Contato",
    description:
      "Entre em contato conosco. Estamos aqui para ajudar com suas necessidades.",
    icon: MessageCircle,
    buttonText: "Falar Conosco",
    to: "/contact",
  },
  {
    title: "Vídeos",
    description: "Dicas de maquiagem e beleza em vídeos exclusivos",
    icon: VideoIcon,
    buttonText: "Ver vídeos",
    to: "/videos",
  },
  {
    title: "Orçamento de Fórmula Magistral",
    description:
      "Faça o orçamento de suas fórmulas conosco, entre em contato e saiba mais.",
    icon: FlaskConicalIcon,
    buttonText: "Entrar em contato",
    whatsappMessage:
      "Olá! Gostaria de saber mais informações sobre Fórmulas Magistral.",
  },
];
