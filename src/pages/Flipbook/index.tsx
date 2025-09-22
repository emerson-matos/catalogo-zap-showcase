import { useProductsQuery } from "@/hooks/useProductsQuery";
import Flipbook from "@/components/Flipbook";
import { BookOpen, Loader2 } from "lucide-react";

export const FlipbookPage = () => {
  const { products, isLoading, error } = useProductsQuery();

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Carregando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h2 className="text-2xl font-bold mb-2 text-destructive">
          Erro ao carregar produtos
        </h2>
        <p className="text-muted-foreground">Tente recarregar a página</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 m-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">
            Revista Digital de Produtos
          </h2>
        </div>
        <div className="flex flex-col gap-2 mb-10 text-lg text-muted-foreground max-w-2xl mx-auto p-4 m-2">
          <p>
            Navegue pelos nossos produtos em um formato interativo de livro. Use
            as setas do teclado ou os botões para virar as páginas.
          </p>
          <br />
          <p>Arraste para visualizar</p>
        </div>
      </div>

      <Flipbook products={products} />
    </div>
  );
};
