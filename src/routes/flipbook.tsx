import { createFileRoute } from "@tanstack/react-router";
import { FlipbookPage } from "@/pages/Flipbook";

export const Route = createFileRoute("/flipbook")({
  component: FlipbookPage,
  meta: () => [
    { title: 'Catálogo Interativo - SeRena Cosméticos' },
    { name: 'description', content: 'Navegue pelos nossos produtos em um catálogo interativo em formato de livro digital' },
  ],
});

