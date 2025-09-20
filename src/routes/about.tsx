import { createFileRoute } from '@tanstack/react-router'
import About from '@/components/About'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () => ({
    meta: [
      {
        title: 'Sobre Nós - SeRena Cosméticos',
      },
      {
        name: 'description',
        content: 'Conheça a história e os valores da SeRena Cosméticos. Distribuidora de cosméticos do ABC paulista com atendimento personalizado.',
      },
      {
        name: 'og:title',
        content: 'Sobre Nós - SeRena Cosméticos',
      },
      {
        name: 'og:description',
        content: 'Conheça a história e os valores da SeRena Cosméticos. Distribuidora de cosméticos do ABC paulista com atendimento personalizado.',
      },
    ],
  }),
})

function AboutPage() {
  return <About sectionId="about" />
}