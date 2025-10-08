import { Home } from "@/pages/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SeRena Cosméticos - Distribuidora de Cosméticos do ABC Paulista",
  description:
    "SeRena Cosméticos é uma distribuidora de cosméticos no ABC paulista. Oferecemos produtos de qualidade com atendimento personalizado via WhatsApp.",
  keywords:
    "cosméticos, distribuidora, ABC paulista, Santo André, cosméticos qualidade, atendimento personalizado",
  openGraph: {
    title: "SeRena Cosméticos - Distribuidora de Cosméticos do ABC Paulista",
    description:
      "SeRena Cosméticos é uma distribuidora de cosméticos no ABC paulista. Oferecemos produtos de qualidade com atendimento personalizado via WhatsApp.",
    images: ["/assets/logo.png"],
  },
};

export default function Page() {
  return <Home />;
}
