import { createFileRoute } from "@tanstack/react-router";
import About from "@/components/About";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto">
      <About sectionId="quem-somos" />
    </div>
  );
}

