import { createFileRoute } from "@tanstack/react-router";
import { useProduct } from "@/hooks/useProductsQuery";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatPriceBRL } from "@/lib/utils";
import { ImageGallery } from "@/components/ImageGallery";
import { useCategoryQuery } from "@/hooks/useCategoryQuery";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const { product, isLoading, error } = useProduct(id || "");
  const { data: category, isLoading: isCategoryLoading } = useCategoryQuery(
    product?.category_id || "",
  );

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
          <ImageGallery
            images={product.images || []}
            productName={product.name}
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

            {!isCategoryLoading && category && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Categoria:{" "}
                </span>
                <span className="font-medium">{category.name}</span>
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
