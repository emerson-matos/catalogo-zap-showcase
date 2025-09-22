import { createFileRoute } from "@tanstack/react-router";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatPriceBRL } from "@/lib/utils";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      variant: (search.variant as string) || undefined,
    };
  },
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { variant } = Route.useSearch();
  const { products, isLoading, error } = useProductsQuery();

  const product = products?.find((p) => p.id === productId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
        <p className="text-muted-foreground mb-4">
          O produto que você está procurando não foi encontrado.
        </p>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Produtos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Produtos
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPriceBRL(product.price)}
              </span>
            </div>

            {product.category && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Categoria:{" "}
                </span>
                <span className="font-medium">{product.category}</span>
              </div>
            )}

            {variant && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Variante:{" "}
                </span>
                <span className="font-medium">{variant}</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button size="lg" className="w-full">
              Entrar em Contato via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

