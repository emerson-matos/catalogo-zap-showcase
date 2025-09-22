import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/components/Contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Contact sectionId="contato" />
    </div>
  );
}

