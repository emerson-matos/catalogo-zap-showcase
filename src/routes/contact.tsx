import { createFileRoute } from '@tanstack/react-router'
import Contact from '@/components/Contact'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () => ({
    meta: [
      {
        title: 'Contato - SeRena Cosméticos',
      },
      {
        name: 'description',
        content: 'Entre em contato com a SeRena Cosméticos. Atendimento via WhatsApp, telefone e e-mail. Localizada em Santo André - SP.',
      },
      {
        name: 'og:title',
        content: 'Contato - SeRena Cosméticos',
      },
      {
        name: 'og:description',
        content: 'Entre em contato com a SeRena Cosméticos. Atendimento via WhatsApp, telefone e e-mail. Localizada em Santo André - SP.',
      },
    ],
  }),
})

function ContactPage() {
  return <Contact sectionId="contact" />
}