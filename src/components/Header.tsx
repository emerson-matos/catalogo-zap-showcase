import { useState } from "react";
import { Menu, X, Package, BookOpen, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Link, useLocation } from "@tanstack/react-router";
import { preloadRoutes } from "@/lib/routePreloading";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Only scroll if we're on the home page
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Package className="size-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text">
                SeRena Cosméticos
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" onMouseEnter={() => preloadRoutes.onHover('/')}>
              <Button
                variant={isActiveRoute('/') ? "default" : "ghost"}
                className="hover:text-primary transition-colors"
              >
                Início
              </Button>
            </Link>
            <Link to="/products" onMouseEnter={() => preloadRoutes.onHover('/products')}>
              <Button
                variant={isActiveRoute('/products') ? "default" : "ghost"}
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Produtos
              </Button>
            </Link>
            <Link to="/flipbook" onMouseEnter={() => preloadRoutes.onHover('/flipbook')}>
              <Button
                variant={isActiveRoute('/flipbook') ? "default" : "ghost"}
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Catálogo
              </Button>
            </Link>
            <Link to="/about" onMouseEnter={() => preloadRoutes.onHover('/about')}>
              <Button
                variant={isActiveRoute('/about') ? "default" : "ghost"}
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Sobre
              </Button>
            </Link>
            <Link to="/contact" onMouseEnter={() => preloadRoutes.onHover('/contact')}>
              <Button
                variant={isActiveRoute('/contact') ? "default" : "ghost"}
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contato
              </Button>
            </Link>
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
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActiveRoute('/') ? "default" : "ghost"}
                  className="text-left hover:text-primary transition-colors justify-start w-full"
                >
                  Início
                </Button>
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActiveRoute('/products') ? "default" : "ghost"}
                  className="text-left hover:text-primary transition-colors justify-start flex items-center gap-2 w-full"
                >
                  <Package className="w-4 h-4" />
                  Produtos
                </Button>
              </Link>
              <Link to="/flipbook" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActiveRoute('/flipbook') ? "default" : "ghost"}
                  className="text-left hover:text-primary transition-colors justify-start flex items-center gap-2 w-full"
                >
                  <BookOpen className="w-4 h-4" />
                  Catálogo
                </Button>
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActiveRoute('/about') ? "default" : "ghost"}
                  className="text-left hover:text-primary transition-colors justify-start flex items-center gap-2 w-full"
                >
                  <Users className="w-4 h-4" />
                  Sobre
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActiveRoute('/contact') ? "default" : "ghost"}
                  className="text-left hover:text-primary transition-colors justify-start flex items-center gap-2 w-full"
                >
                  <Phone className="w-4 h-4" />
                  Contato
                </Button>
              </Link>
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
