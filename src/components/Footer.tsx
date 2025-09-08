import { Package, MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const whatsappNumber = "5511999999999"; // Substitua pelo número real
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-8 h-8" />
              <span className="text-xl font-bold">CatálogoPlus</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Sua loja digital completa com os melhores produtos e atendimento
              personalizado via WhatsApp.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Button
                  onClick={() =>
                    document
                      .getElementById("hero")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-primary-foreground transition-colors"
                >
                  Início
                </Button>
              </li>
              <li>
                <Button
                  onClick={() =>
                    document
                      .getElementById("produtos")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-primary-foreground transition-colors"
                >
                  Produtos
                </Button>
              </li>
              <li>
                <Button
                  onClick={() =>
                    document
                      .getElementById("contato")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-primary-foreground transition-colors"
                >
                  Contato
                </Button>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <MessageCircle className="size-4" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  (11) 99999-9999
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="size-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="size-4" />
                <span>contato@catalogoplus.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 CatálogoPlus. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

