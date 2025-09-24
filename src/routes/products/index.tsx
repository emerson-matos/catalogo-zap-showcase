import { createFileRoute } from "@tanstack/react-router";
import ProductGrid from "@/components/ProductGrid";
import { useProductsQuery } from "@/hooks/useProductsQuery";

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
  const { 
    products, 
    isLoading, 
    isFetching, 
    error, 
    isError, 
    refetch, 
    isEmpty, 
    isStale 
  } = useProductsQuery();

  return (
    <div className="min-h-screen">
      <ProductGrid
        sectionId="products"
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        isError={isError}
        isEmpty={isEmpty}
        isStale={isStale}
        onRefetch={refetch}
        title="Nossos Produtos"
        subtitle="Descubra nossa seleção cuidadosa de produtos de alta qualidade"
        showStatistics={true}
        isAdmin={false}
        searchPlaceholder="Pesquisar produtos..."
      />
      <CartFloat />
    </div>
  );
}
