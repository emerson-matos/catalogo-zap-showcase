import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vídeos de Beleza",
  description:
    "Assista aos nossos vídeos exclusivos com dicas de maquiagem e beleza",
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

