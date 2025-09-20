import { createFileRoute } from '@tanstack/react-router'
import ProductGrid from '@/components/ProductGrid'

export const Route = createFileRoute('/_layout/products')({
  component: ProductsPage,
  meta: () => [
    { title: 'Produtos - SeRena Cosméticos' },
    { name: 'description', content: 'Conheça nossa linha completa de cosméticos e produtos de beleza' },
  ],
})

function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Nossos Produtos</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubra nossa seleção cuidadosa de cosméticos e produtos de beleza de alta qualidade
        </p>
      </div>
      <ProductGrid sectionId="produtos" />
    </div>
  )
}