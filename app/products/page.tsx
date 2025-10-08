"use client";

import ProductGrid from "@/components/ProductGrid";
import { CartFloat } from "@/components/CartFloat";

export default function ProductsPage() {
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
