import Contact from "@/components/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a SeRena Cosméticos",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Contact sectionId="contato" />
    </div>
  );
}
