import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-catalog.jpg";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const Hero = () => {
  const whatsappUrl = createWhatsAppUrl({
    message: "Olá! Gostaria de conhecer seus produtos. Poderia me ajudar?",
  });

  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-secondary-foreground/20"></div>
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Catálogo Digital
              <span className="block font-light text-secondary-foreground">
                Moderno
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
              Descubra nossa coleção exclusiva de produtos selecionados
              especialmente para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => window.open(whatsappUrl, "_blank")}
                className="text-lg px-8 py-4 h-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Fale Conosco
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 h-auto"
                onClick={() =>
                  document
                    .getElementById("produtos")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver Produtos
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Catálogo Digital Moderno"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

