import { createFileRoute } from "@tanstack/react-router";
import About from "@/components/About";

export const Route = createFileRoute("/_layout/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <About sectionId="quem-somos" />
    </div>
  );
}

