import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/pages/Home'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      {
        title: 'SeRena Cosméticos - Distribuidora de Cosméticos do ABC Paulista',
      },
      {
        name: 'description',
        content: 'SeRena Cosméticos é uma distribuidora de cosméticos no ABC paulista. Oferecemos produtos de qualidade com atendimento personalizado via WhatsApp.',
      },
      {
        name: 'keywords',
        content: 'cosméticos, distribuidora, ABC paulista, Santo André, cosméticos qualidade, atendimento personalizado',
      },
      {
        name: 'og:title',
        content: 'SeRena Cosméticos - Distribuidora de Cosméticos do ABC Paulista',
      },
      {
        name: 'og:description',
        content: 'SeRena Cosméticos é uma distribuidora de cosméticos no ABC paulista. Oferecemos produtos de qualidade com atendimento personalizado via WhatsApp.',
      },
      {
        name: 'og:image',
        content: '/assets/logo.png',
      },
    ],
  }),
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  ),
})
