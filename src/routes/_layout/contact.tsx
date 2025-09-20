import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/components/Contact";

export const Route = createFileRoute("/_layout/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Estamos aqui para ajudar você a encontrar os melhores produtos
        </p>
      </div>
      <Contact sectionId="contato" />
    </div>
  );
}