import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  HomeIcon,
  MessageCircle,
  ShoppingBag,
  Users,
} from "lucide-react";

export interface NavigationItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    to: "/",
    label: "Início",
    icon: HomeIcon,
  },
  {
    to: "/products",
    label: "Produtos",
    icon: ShoppingBag,
  },
  {
    to: "/about",
    label: "Sobre",
    icon: Users,
  },
  {
    to: "/flipbook",
    label: "Revista Digital",
    icon: BookOpen,
  },
  {
    to: "/contact",
    label: "Contato",
    icon: MessageCircle,
  },
];
