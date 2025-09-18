import heroImage from "@/assets/hero-catalog.jpg";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./ui/whatsapp-button";

const Hero = ({ sectionId }: { sectionId: string }) => {
  return (
    <section
      id={sectionId}
      className="relative bg-gradient-hero overflow-hidden"
    >
      <div className="absolute inset-0 bg-secondary-foreground/20"></div>
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <p className="mask-origin-stroke italic">SeRena</p>
              <span className="block font-light text-secondary-foreground">
                Produtos de saúde e beleza
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
              Descubra nossa coleção exclusiva de produtos selecionados
              especialmente para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <WhatsAppButton
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 h-auto"
              >
                Fale Conosco
              </WhatsAppButton>
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
          <div className="w-full aspect-video overflow-clip">
            <img
              src={heroImage}
              alt="SeRena Cosméticos Logo"
              className="w-full h-150 object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
