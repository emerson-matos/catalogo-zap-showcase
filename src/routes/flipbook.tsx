import { createFileRoute } from "@tanstack/react-router";
import { FlipbookPage } from "@/pages/Flipbook";

export const Route = createFileRoute("/flipbook")({
  component: FlipbookPage,
  head: () => ({
    meta: [
      {
        title: "Revista Digital - SeRena Cosméticos",
      },
      {
        name: "description",
        content:
          "Navegue pelos nossos produtos em um formato interativo de livro. Use as setas do teclado ou os botões para virar as páginas.",
      },
      {
        name: "keywords",
        content: "catálogo, produtos, cosméticos, livro interativo, navegação",
      },
      {
        name: "og:title",
        content: "Revista Digital - SeRena Cosméticos",
      },
      {
        name: "og:description",
        content:
          "Navegue pelos nossos produtos em um formato interativo de livro. Use as setas do teclado ou os botões para virar as páginas.",
      },
    ],
  }),
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando catálogo...</p>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-destructive mb-4">
          Erro ao carregar catálogo
        </h1>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error
            ? error.message
            : "Não foi possível carregar o catálogo de produtos"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  ),
});
