import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MessageCircle, Package } from "lucide-react";

export const Home = () => {
  return (
    <>
        <Hero sectionId="hero" />
        <ProductGrid sectionId="produtos" />
        
        {/* Quick Navigation Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore Nossa Empresa</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Conheça mais sobre a SeRena Cosméticos e nossos serviços
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Link to="/about">
                <div className="bg-gradient-card shadow-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Sobre Nós</h3>
                  <p className="text-muted-foreground mb-4">
                    Conheça nossa história, valores e o que nos torna únicos no mercado de cosméticos.
                  </p>
                  <Button variant="outline" className="w-full">
                    Saiba Mais <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Link>
              
              <Link to="/products">
                <div className="bg-gradient-card shadow-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-accent/10 p-4 rounded-lg w-fit mx-auto mb-4">
                    <Package className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Produtos</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore nossa linha completa de produtos cosméticos de qualidade.
                  </p>
                  <Button variant="outline" className="w-full">
                    Ver Produtos <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Link>
              
              <Link to="/contact">
                <div className="bg-gradient-card shadow-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-whatsapp/10 p-4 rounded-lg w-fit mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-whatsapp" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Contato</h3>
                  <p className="text-muted-foreground mb-4">
                    Entre em contato conosco. Estamos aqui para ajudar com suas necessidades.
                  </p>
                  <Button variant="outline" className="w-full">
                    Falar Conosco <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        <About sectionId="quem-somos" />
        <Contact sectionId="contato" />
    </>
  );
};