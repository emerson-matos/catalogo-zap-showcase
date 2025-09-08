import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import produtoSmartphone from "@/assets/produto-smartphone.jpg";
import produtoHeadphones from "@/assets/produto-headphones.jpg";
import produtoCosmetico from "@/assets/produto-cosmetico.jpg";
import produtoCafe from "@/assets/produto-cafe.jpg";

// Dados de exemplo - em produção, viriam de uma API ou CMS
const products = [
  {
    id: "1",
    name: "Smartphone Premium",
    description:
      "Smartphone de última geração com câmera profissional e desempenho excepcional.",
    price: "R$ 2.999,00",
    image: produtoSmartphone,
    category: "Eletrônicos",
    rating: 4.8,
    isNew: true,
  },
  {
    id: "2",
    name: "Fones Bluetooth Pro",
    description:
      "Fones de ouvido sem fio com cancelamento de ruído e qualidade de áudio superior.",
    price: "R$ 899,00",
    image: produtoHeadphones,
    category: "Eletrônicos",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Creme Anti-Idade Premium",
    description:
      "Creme facial com ingredientes naturais para rejuvenescimento da pele.",
    price: "R$ 189,00",
    image: produtoCosmetico,
    category: "Cosméticos",
    rating: 4.9,
    isNew: true,
  },
  {
    id: "4",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produtoCafe,
    category: "Bebidas",
    rating: 4.6,
  },
];

const categories = ["Todos", "Eletrônicos", "Cosméticos", "Bebidas"];

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <section id="produtos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nossos Produtos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosa de produtos de alta qualidade
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-300"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Estatísticas */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
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

