import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";

const ProductGrid = ({ sectionId }: { sectionId: string }) => {
  const { products, categories, selectedCategory, setSelectedCategory, totalProducts } = useProducts();

  return (
    <section id={sectionId} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nossos Produtos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosa de produtos de alta qualidade
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all duration-300"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">{totalProducts}+</div>
            <div className="text-muted-foreground">Produtos Disponíveis</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-muted-foreground">Clientes Satisfeitos</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">24h</div>
            <div className="text-muted-foreground">Atendimento Rápido</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
