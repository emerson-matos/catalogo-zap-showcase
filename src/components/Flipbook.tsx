import React from "react";

import logoImage from "@/assets/logo.png";
import { BookOpen } from "lucide-react";
import type { Product } from "@/types/product";
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
            <div className=" w-full aspect-video overflow-clip">
              <img
                src={logoImage}
                alt="SeRena Cosméticos Logo"
                className="border-4 bg-white-500 w-full h-70 sm:h-150 object-fill md:object-fill object-center"
              />
              <div className="text-lg mt-4 italic flex justify-center text-center">
                você é seu maior investimento, cuide-se.
              </div>
            </div>
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
