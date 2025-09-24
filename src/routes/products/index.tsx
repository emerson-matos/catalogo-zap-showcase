import { createFileRoute } from "@tanstack/react-router";
import ProductGrid from "@/components/ProductGrid";

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
  head: () => ({
    meta: [
      {
        title: "Produtos - SeRena Cosméticos",
      },
      {
        name: "description",
        content:
          "Conheça nossa linha completa de produtos cosméticos. Qualidade garantida com atendimento personalizado.",
      },
      {
        name: "keywords",
        content: "produtos, cosméticos, linha completa, qualidade, SeRena",
      },
      {
        name: "og:title",
        content: "Produtos - SeRena Cosméticos",
      },
      {
        name: "og:description",
        content:
          "Conheça nossa linha completa de produtos cosméticos. Qualidade garantida com atendimento personalizado.",
      },
    ],
  }),
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando produtos...</p>
      </div>
    </div>
  ),
});

import { CartFloat } from "@/components/CartFloat";

function ProductsPage() {
  return (
    <div className="min-h-screen">
      <section>
        <div className="text-center m-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-4xl font-bold text-primary">Nossos Produtos</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosa de produtos de alta qualidade
          </p>
        </div>
      </section>
      <ProductGrid />
      <CartFloat />
    </div>
  );
}
