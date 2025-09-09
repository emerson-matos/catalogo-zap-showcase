import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero sectionId="hero" />
        <ProductGrid sectionId="produtos" />
        <Contact sectionId="contato" />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};