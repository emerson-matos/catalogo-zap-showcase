import About from "@/components/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: "Conheça a SeRena Cosméticos e nossa história",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto">
      <About sectionId="quem-somos" />
    </div>
  );
}
