import Hero from "@/components/Hero";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  MessageCircle,
  Package,
  BookOpen,
} from "lucide-react";

import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useEffect, useState } from "react";

export const WelcomeMessage = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Bem vindo ao nosso site, aproveite as novidades!";
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 150;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && index < fullText.length) {
        setDisplayText(fullText.substring(0, index + 1));
        setIndex(index + 1);
      } else if (!isDeleting && index === fullText.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && index > 0) {
        setDisplayText(fullText.substring(0, index - 1));
        setIndex(index - 1);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [index, isDeleting, fullText]);

  return (
    <div className="flex items-center justify-center m-4 p-4">
      <div className="text-center">
        <div className="relative inline-block">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
            {displayText}
            <span className="animate-pulse text-cyan-400">|</span>
          </h1>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export const Home = () => {
  return (
    <>
      <WelcomeMessage />
      <Hero sectionId="hero" />
      <WhatsAppFloat />
      {/* Quick Navigation Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Nossa Empresa</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conheça mais sobre a SeRena Cosméticos e nossos serviços
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Link to="/about">
              <div className="bg-gradient-card shadow-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Sobre Nós</h3>
                <p className="text-muted-foreground mb-4">
                  Conheça nossa história, valores e o que nos torna únicos no
                  mercado de cosméticos.
                </p>
                <Button variant="outline" className="w-full">
                  Saiba Mais <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>

            <Link to="/products">
              <div className="bg-gradient-card shadow-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Produtos</h3>
                <p className="text-muted-foreground mb-4">
                  Explore nossa linha completa de produtos cosméticos de
                  qualidade.
                </p>
                <Button variant="outline" className="w-full">
                  Ver Produtos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>

            <Link to="/flipbook">
              <div className="bg-gradient-card shadow-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Catálogo</h3>
                <p className="text-muted-foreground mb-4">
                  Navegue pelos nossos produtos em um formato interativo de
                  livro.
                </p>
                <Button variant="outline" className="w-full">
                  Ver Catálogo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>

            <Link to="/contact">
              <div className="bg-gradient-card shadow-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Contato</h3>
                <p className="text-muted-foreground mb-4">
                  Entre em contato conosco. Estamos aqui para ajudar com suas
                  necessidades.
                </p>
                <Button variant="outline" className="w-full">
                  Falar Conosco <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
