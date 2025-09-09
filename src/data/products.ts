import type { Product } from '@/types/product';
import produto1 from '@/assets/1.jpeg';
import produto2 from '@/assets/2.jpeg';
import produto3 from '@/assets/3.jpeg';
import produto4 from '@/assets/4.jpeg';
import produto5 from '@/assets/5.jpeg';
import produto6 from '@/assets/6.jpeg';
import produto7 from '@/assets/7.jpeg';
import produto8 from '@/assets/8.jpeg';
import produto9 from '@/assets/9.jpeg';
import produto10 from '@/assets/10.jpeg';
import produto11 from '@/assets/11.jpeg';
import produto12 from '@/assets/12.jpeg';
import produto13 from '@/assets/13.jpeg';
import produto14 from '@/assets/14.jpeg';
import produto15 from '@/assets/15.jpeg';
import produto16 from '@/assets/16.jpeg';
import produto17 from '@/assets/17.jpeg';
import produto18 from '@/assets/18.jpeg';
import produto19 from '@/assets/19.jpeg';
import produto20 from '@/assets/20.jpeg';
import produto21 from '@/assets/21.jpeg';
import produto22 from '@/assets/22.jpeg';
import produto23 from '@/assets/23.jpeg';
import produto24 from '@/assets/24.jpeg';
import produto25 from '@/assets/25.jpeg';
import produtoSmartphone from '@/assets/produto-smartphone.jpg';
import produtoHeadphones from '@/assets/produto-headphones.jpg';
import produtoCosmetico from '@/assets/produto-cosmetico.jpg';
import produtoCafe from '@/assets/produto-cafe.jpg';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smartphone Premium',
    description: 'Smartphone de última geração com câmera profissional e desempenho excepcional.',
    price: 2999.00,
    image: produtoSmartphone,
    category: 'Eletrônicos',
    rating: 4.8,
    isNew: true,
  },
  {
    id: '2',
    name: 'Fones Bluetooth Pro',
    description: 'Fones de ouvido sem fio com cancelamento de ruído e qualidade de áudio superior.',
    price: 899.00,
    image: produtoHeadphones,
    category: 'Eletrônicos',
    rating: 4.7,
  },
  {
    id: '3',
    name: 'Creme Anti-Idade Premium',
    description: 'Creme facial com ingredientes naturais para rejuvenescimento da pele.',
    price: 189.00,
    image: produtoCosmetico,
    category: 'Cosméticos',
    rating: 4.9,
    isNew: true,
  },
  {
    id: '4',
    name: 'Café Especial Gourmet',
    description: 'Café premium torrado artesanalmente com grãos selecionados especiais.',
    price: 45.00,
    image: produtoCafe,
    category: 'Bebidas',
    rating: 4.6,
  },
  // Additional products with unique names and descriptions
  {
    id: '5',
    name: 'Café Arábica Premium',
    description: 'Grãos de café arábica selecionados, torrados artesanalmente para sabor único.',
    price: 52.00,
    image: produto1,
    category: 'Bebidas',
    rating: 4.5,
  },
  {
    id: '6',
    name: 'Café Robusta Especial',
    description: 'Café robusta com corpo intenso e aroma marcante, perfeito para espresso.',
    price: 48.00,
    image: produto2,
    category: 'Bebidas',
    rating: 4.4,
  },
  {
    id: '7',
    name: 'Café Descafeinado',
    description: 'Café sem cafeína mantendo todo o sabor e aroma do café tradicional.',
    price: 55.00,
    image: produto3,
    category: 'Bebidas',
    rating: 4.3,
  },
  {
    id: '8',
    name: 'Café Orgânico',
    description: 'Café cultivado sem agrotóxicos, com certificação orgânica.',
    price: 65.00,
    image: produto4,
    category: 'Bebidas',
    rating: 4.7,
    isNew: true,
  },
  {
    id: '9',
    name: 'Café Torrado Escuro',
    description: 'Torra escura que realça o sabor intenso e o aroma característico.',
    price: 50.00,
    image: produto5,
    category: 'Bebidas',
    rating: 4.6,
  },
  {
    id: '10',
    name: 'Café Torrado Claro',
    description: 'Torra clara que preserva a acidez natural e sabores frutados.',
    price: 47.00,
    image: produto6,
    category: 'Bebidas',
    rating: 4.4,
  },
  {
    id: '11',
    name: 'Café Blend Premium',
    description: 'Mistura especial de grãos arábica e robusta para sabor equilibrado.',
    price: 58.00,
    image: produto7,
    category: 'Bebidas',
    rating: 4.8,
  },
  {
    id: '12',
    name: 'Café Single Origin',
    description: 'Café de origem única, cultivado em região específica para sabor exclusivo.',
    price: 75.00,
    image: produto8,
    category: 'Bebidas',
    rating: 4.9,
    isNew: true,
  },
  {
    id: '13',
    name: 'Café Cold Brew',
    description: 'Café preparado a frio por 12 horas para sabor suave e menos acidez.',
    price: 42.00,
    image: produto9,
    category: 'Bebidas',
    rating: 4.5,
  },
  {
    id: '14',
    name: 'Café Espresso',
    description: 'Grãos especiais para espresso com crema perfeita e sabor intenso.',
    price: 60.00,
    image: produto10,
    category: 'Bebidas',
    rating: 4.7,
  },
  {
    id: '15',
    name: 'Café French Press',
    description: 'Café moído grosso ideal para preparo em prensa francesa.',
    price: 45.00,
    image: produto11,
    category: 'Bebidas',
    rating: 4.3,
  },
  {
    id: '16',
    name: 'Café V60',
    description: 'Grãos selecionados para método de preparo V60 com filtro de papel.',
    price: 55.00,
    image: produto12,
    category: 'Bebidas',
    rating: 4.6,
  },
  {
    id: '17',
    name: 'Café Chemex',
    description: 'Café especial para preparo em Chemex com sabor limpo e claro.',
    price: 62.00,
    image: produto13,
    category: 'Bebidas',
    rating: 4.8,
  },
  {
    id: '18',
    name: 'Café Aeropress',
    description: 'Grãos otimizados para Aeropress com extração rápida e sabor concentrado.',
    price: 50.00,
    image: produto14,
    category: 'Bebidas',
    rating: 4.5,
  },
  {
    id: '19',
    name: 'Café Moka Pot',
    description: 'Café moído fino ideal para cafeteira italiana Moka.',
    price: 48.00,
    image: produto15,
    category: 'Bebidas',
    rating: 4.4,
  },
  {
    id: '20',
    name: 'Café Percolator',
    description: 'Café especial para cafeteira percolator com sabor tradicional.',
    price: 46.00,
    image: produto16,
    category: 'Bebidas',
    rating: 4.2,
  },
  {
    id: '21',
    name: 'Café Siphon',
    description: 'Grãos premium para preparo em sifão com método de vapor.',
    price: 80.00,
    image: produto17,
    category: 'Bebidas',
    rating: 4.9,
    isNew: true,
  },
  {
    id: '22',
    name: 'Café Turkish',
    description: 'Café moído extra fino para preparo turco tradicional.',
    price: 44.00,
    image: produto18,
    category: 'Bebidas',
    rating: 4.3,
  },
  {
    id: '23',
    name: 'Café Vietnamese',
    description: 'Café especial para preparo vietnamita com leite condensado.',
    price: 52.00,
    image: produto19,
    category: 'Bebidas',
    rating: 4.6,
  },
  {
    id: '24',
    name: 'Café Ethiopian',
    description: 'Café etíope com notas frutadas e floral características da região.',
    price: 70.00,
    image: produto20,
    category: 'Bebidas',
    rating: 4.8,
  },
  {
    id: '25',
    name: 'Café Colombian',
    description: 'Café colombiano premium com sabor suave e aroma equilibrado.',
    price: 65.00,
    image: produto21,
    category: 'Bebidas',
    rating: 4.7,
  },
  {
    id: '26',
    name: 'Café Brazilian',
    description: 'Café brasileiro de alta qualidade com sabor tradicional.',
    price: 40.00,
    image: produto22,
    category: 'Bebidas',
    rating: 4.5,
  },
  {
    id: '27',
    name: 'Café Guatemalan',
    description: 'Café guatemalteco com notas de chocolate e nozes.',
    price: 68.00,
    image: produto23,
    category: 'Bebidas',
    rating: 4.6,
  },
  {
    id: '28',
    name: 'Café Costa Rican',
    description: 'Café costa-riquenho com acidez brilhante e sabor limpo.',
    price: 72.00,
    image: produto24,
    category: 'Bebidas',
    rating: 4.7,
  },
  {
    id: '29',
    name: 'Café Jamaican Blue Mountain',
    description: 'Café jamaicano Blue Mountain, considerado um dos melhores do mundo.',
    price: 150.00,
    image: produto25,
    category: 'Bebidas',
    rating: 5.0,
    isNew: true,
  },
];
