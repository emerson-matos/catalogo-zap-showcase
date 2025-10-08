import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Conheça nossa linha completa de produtos cosméticos. Qualidade garantida com atendimento personalizado.",
  keywords: "produtos, cosméticos, linha completa, qualidade, SeRena",
  openGraph: {
    title: "Produtos - SeRena Cosméticos",
    description:
      "Conheça nossa linha completa de produtos cosméticos. Qualidade garantida com atendimento personalizado.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

