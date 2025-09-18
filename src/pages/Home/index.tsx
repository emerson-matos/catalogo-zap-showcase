import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export const Home = () => {
  return (
    <>
        <Hero sectionId="hero" />
        <ProductGrid sectionId="produtos" />
        <About sectionId="quem-somos" />
        <Contact sectionId="contato" />
    </>
  );
};