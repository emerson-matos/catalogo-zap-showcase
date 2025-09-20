import { createFileRoute } from '@tanstack/react-router'
import About from '@/components/About'

export const Route = createFileRoute('/_layout/about')({
  component: AboutPage,
  meta: () => [
    { title: 'Sobre Nós - SeRena Cosméticos' },
    { name: 'description', content: 'Conheça a história da SeRena Cosméticos, distribuidora de cosméticos do ABC paulista' },
  ],
})

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Sobre Nós</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Conheça nossa história e compromisso com a qualidade
        </p>
      </div>
      <About sectionId="quem-somos" />
    </div>
  )
}