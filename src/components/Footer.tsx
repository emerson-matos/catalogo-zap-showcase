import { Package, MessageCircle, Phone, Mail } from "lucide-react";
import { getWhatsAppNumber } from "@/lib/whatsapp";

const Footer = () => {
  const whatsappNumber = getWhatsAppNumber();
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-8 h-8" />
              <span className="text-xl font-bold">DungaStore</span>
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
                <a
                  href="#hero"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("hero")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-primary-foreground transition-colors inline-flex items-center"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#produtos"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("produtos")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-primary-foreground transition-colors inline-flex items-center"
                >
                  Produtos
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("contato")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-primary-foreground transition-colors inline-flex items-center"
                >
                  Contato
                </a>
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
                <span>{whatsappNumber ? `+${whatsappNumber}` : "(11) 99999-9999"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="size-4" />
                <span>contato@dungastore.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 DungaStore. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

