import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Star } from "lucide-react";
import { formatPriceBRL } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group h-full bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 border-0">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-0" />
          <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {product.isNew && (
                <Badge className="bg-accent text-accent-foreground">Novo</Badge>
              )}
            </div>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary">
              {formatPriceBRL(product.price)}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <WhatsAppButton product={product} size="default" className="w-full justify-center">Consultar Produto</WhatsAppButton>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
