import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revista Digital",
  description:
    "Navegue pelos nossos produtos em um formato interativo de livro. Use as setas do teclado ou os botões para virar as páginas.",
  keywords: "catálogo, produtos, cosméticos, livro interativo, navegação",
  openGraph: {
    title: "Revista Digital - SeRena Cosméticos",
    description:
      "Navegue pelos nossos produtos em um formato interativo de livro. Use as setas do teclado ou os botões para virar as páginas.",
  },
};

export default function FlipbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
