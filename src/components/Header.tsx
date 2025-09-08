import { useState } from "react";
import { MessageCircle, Menu, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whatsappMessage = "Olá! Gostaria de conhecer mais sobre seus produtos.";
  const whatsappNumber = "5511999999999"; // Substitua pelo número real
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Package className="size-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text">
              CatálogoPlus
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button
              onClick={() => scrollToSection("hero")}
              className="hover:text-primary transition-colors"
            >
              Início
            </Button>
            <Button
              onClick={() => scrollToSection("produtos")}
              className="hover:text-primary transition-colors"
            >
              Produtos
            </Button>
            <Button
              onClick={() => scrollToSection("contato")}
              className="hover:text-primary transition-colors"
            >
              Contato
            </Button>
          </nav>

          {/* WhatsApp Button Desktop */}
          <div className="hidden md:flex">
            <Button
              variant="ghost"
              onClick={() => window.open(whatsappUrl, "_blank")}
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col space-y-4">
              <Button
                onClick={() => scrollToSection("hero")}
                className="text-left hover:text-primary transition-colors"
              >
                Início
              </Button>
              <Button
                onClick={() => scrollToSection("produtos")}
                className="text-left hover:text-primary transition-colors"
              >
                Produtos
              </Button>
              <Button
                onClick={() => scrollToSection("contato")}
                className="text-left hover:text-primary transition-colors"
              >
                Contato
              </Button>
              <Button
                variant="ghost"
                className="w-fit"
                onClick={() => window.open(whatsappUrl, "_blank")}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

