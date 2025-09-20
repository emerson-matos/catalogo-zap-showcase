import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/pages/Home'

export const Route = createFileRoute('/')({
  component: Home,
  meta: () => [
    { title: 'SeRena Cosméticos - Distribuidora de Cosméticos ABC Paulista' },
    { name: 'description', content: 'Distribuidora de cosméticos do ABC paulista. Produtos de qualidade para sua beleza e bem-estar.' },
    { name: 'keywords', content: 'cosméticos, distribuidora, ABC paulista, beleza, produtos' },
  ],
})
