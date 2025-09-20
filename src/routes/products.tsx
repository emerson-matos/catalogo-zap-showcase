import { createFileRoute } from '@tanstack/react-router'
import ProductGrid from '@/components/ProductGrid'

export const Route = createFileRoute('/products')({
  component: ProductsPage,
  head: () => ({
    meta: [
      {
        title: 'Produtos - SeRena Cosméticos',
      },
      {
        name: 'description',
        content: 'Conheça nossa linha completa de produtos cosméticos. Qualidade garantida com atendimento personalizado.',
      },
      {
        name: 'keywords',
        content: 'produtos, cosméticos, linha completa, qualidade, SeRena',
      },
      {
        name: 'og:title',
        content: 'Produtos - SeRena Cosméticos',
      },
      {
        name: 'og:description',
        content: 'Conheça nossa linha completa de produtos cosméticos. Qualidade garantida com atendimento personalizado.',
      },
    ],
  }),
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando produtos...</p>
      </div>
    </div>
  ),
})

function ProductsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ProductGrid sectionId="products" />
      </div>
    </div>
  )
}
