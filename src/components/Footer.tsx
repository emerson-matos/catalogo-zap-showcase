import { Package, MessageCircle, Phone, Mail } from "lucide-react";
import { getWhatsAppNumber } from "@/lib/whatsapp";

const Footer = () => {
  const whatsappNumber = getWhatsAppNumber();
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "https://wa.me";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-8 h-8" />
              <span className="text-xl font-bold">SeRena Cosméticos</span>
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
                <button
                  onClick={() =>
                    document
                      .getElementById("hero")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-left hover:text-primary-foreground transition-colors underline-offset-4 hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("produtos")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-left hover:text-primary-foreground transition-colors underline-offset-4 hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("contato")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-left hover:text-primary-foreground transition-colors underline-offset-4 hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Contato
                </button>
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
                  {whatsappNumber ? `+${whatsappNumber}` : "WhatsApp"}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="size-4" />
                <span>
                  {whatsappNumber
                    ? `+${whatsappNumber.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4")}`
                    : "(11) 99999-9999"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="size-4" />
                <span>contato@dungastore.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 SeRena Cosméticos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
