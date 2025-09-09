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
          {product.isNew && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-accent to-accent/90 text-accent-foreground font-bold shadow-lg border border-accent/20 backdrop-blur-sm">
              Novo
            </Badge>
          )}
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-background/90 text-foreground font-semibold shadow-md border border-border backdrop-blur-sm hover:bg-background/95 transition-colors"
          >
            {product.category}
          </Badge>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPriceBRL(product.price)}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium text-accent-foreground">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <WhatsAppButton 
          product={product}
          className="w-full justify-center gap-2 h-11 text-sm font-medium shadow-button hover:shadow-lg transition-all duration-200"
          size="default"
        >
          Consultar Produto
        </WhatsAppButton>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
