import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import produto1 from "@/assets/1.jpeg";
import produto2 from "@/assets/2.jpeg";
import produto3 from "@/assets/3.jpeg";
import produto4 from "@/assets/4.jpeg";
import produto5 from "@/assets/5.jpeg";
import produto6 from "@/assets/6.jpeg";
import produto7 from "@/assets/7.jpeg";
import produto8 from "@/assets/8.jpeg";
import produto9 from "@/assets/9.jpeg";
import produto10 from "@/assets/10.jpeg";
import produto11 from "@/assets/11.jpeg";
import produto12 from "@/assets/12.jpeg";
import produto13 from "@/assets/13.jpeg";
import produto14 from "@/assets/14.jpeg";
import produto15 from "@/assets/15.jpeg";
import produto17 from "@/assets/16.jpeg";
import produto16 from "@/assets/17.jpeg";
import produto18 from "@/assets/18.jpeg";
import produto19 from "@/assets/19.jpeg";
import produto20 from "@/assets/20.jpeg";
import produto21 from "@/assets/21.jpeg";
import produto22 from "@/assets/22.jpeg";
import produto23 from "@/assets/23.jpeg";
import produto24 from "@/assets/24.jpeg";
import produto25 from "@/assets/25.jpeg";
import produto26 from "@/assets/26.jpeg";
import produto27 from "@/assets/27.jpeg";
import produto28 from "@/assets/28.jpeg";
import produto29 from "@/assets/29.jpeg";
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
  {
    id: "18",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto18,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto1,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto2,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "7",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto3,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "8",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto8,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "9",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto9,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "10",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto10,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "11",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto11,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "12",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto12,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "13",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto13,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "14",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto14,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "15",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto15,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "16",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto16,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "17",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto17,
    category: "Bebidas",
    rating: 4.6,
  },

  {
    id: "19",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto19,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "20",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto20,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "21",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto21,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "22",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto22,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "23",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto23,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "24",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto24,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "25",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto25,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "26",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto26,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "27",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto27,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "28",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto28,
    category: "Bebidas",
    rating: 4.6,
  },
  {
    id: "29",
    name: "Café Especial Gourmet",
    description:
      "Café premium torrado artesanalmente com grãos selecionados especiais.",
    price: "R$ 45,00",
    image: produto29,
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
