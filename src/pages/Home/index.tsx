import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import { NavigationCard } from "@/components/NavigationCard";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { navigationCardsData } from "@/constants/navigationCards";

const fullText = "Bem vindo ao nosso site, aproveite as novidades!";

export const WelcomeMessage = () => {
  const [displayText, setDisplayText] = useState("");
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
  }, [index, isDeleting]);

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {navigationCardsData.map((card) => (
              <NavigationCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
