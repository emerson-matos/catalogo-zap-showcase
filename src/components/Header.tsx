import { useState } from "react";
import { Menu, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Link } from "@tanstack/react-router";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              SeRena Cosméticos
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={() => scrollToSection("hero")}
              className="hover:text-primary transition-colors"
            >
              Início
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("produtos")}
              className="hover:text-primary transition-colors"
            >
              Produtos
            </Button>
            <Link to="/flipbook">
              <Button
                variant="ghost"
                className="hover:text-primary transition-colors"
              >
                Catálogo
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("contato")}
              className="hover:text-primary transition-colors"
            >
              Contato
            </Button>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <WhatsAppButton
              variant="ghost"
              size="sm"
              className="hover:text-primary transition-colors bg-transparent hover:bg-whatsapp/10"
            >
              WhatsApp
            </WhatsAppButton>
            <ModeToggle />
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
                variant="ghost"
                onClick={() => scrollToSection("hero")}
                className="text-left hover:text-primary transition-colors justify-start"
              >
                Início
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("produtos")}
                className="text-left hover:text-primary transition-colors justify-start"
              >
                Produtos
              </Button>
              <Link to="/flipbook" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="text-left hover:text-primary transition-colors justify-start w-full"
                >
                  Catálogo
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("contato")}
                className="text-left hover:text-primary transition-colors justify-start"
              >
                Contato
              </Button>
              <WhatsAppButton
                variant="ghost"
                className="w-fit justify-start hover:text-primary transition-colors bg-transparent hover:bg-whatsapp/10"
              >
                WhatsApp
              </WhatsAppButton>
              <ModeToggle />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
