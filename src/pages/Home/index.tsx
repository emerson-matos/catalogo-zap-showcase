import AboutSection from "@/components/AboutSection";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export const Home = () => {
  return (
    <>
        <Hero sectionId="hero" />
        <AboutSection sectionId="quem-somos" />
        <ProductGrid sectionId="produtos" />
        <Contact sectionId="contato" />
    </>
  );
};