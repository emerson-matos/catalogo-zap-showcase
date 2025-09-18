import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import HTMLFlipBook from "react-pageflip";

interface FlipbookProps {
  products: Product[];
}

interface FlipbookPageProps {
  product: Product;
  isLeftPage?: boolean;
}

const PageCover = React.forwardRef(
  (
    { children }: React.PropsWithChildren,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div className="page page-cover" ref={ref} data-density="hard">
        <div className="page-content">{children}</div>
      </div>
    );
  },
);
const FlipbookPage = React.forwardRef(
  ({ product }: FlipbookPageProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className="page page-content">
        <ProductCard product={product} />
      </div>
    );
  },
);

FlipbookPage.displayName = "FlipbookPage";

const Flipbook = ({ products }: FlipbookProps) => {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Nenhum produto encontrado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container m-auto">
      <div className="flex justify-center">
        <HTMLFlipBook
          width={300}
          height={500}
          startPage={0}
          size={"stretch"}
          className="product-book"
          showCover={true}
        >
          {/* Flipbook */}
          <PageCover>
            <h2>Catálogo de Produtos</h2>
            <p>Funciona igual um livro</p>
          </PageCover>
          {products.map((product) => (
            <FlipbookPage key={product.id} product={product} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default Flipbook;
