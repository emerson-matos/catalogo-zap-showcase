import { useState } from "react";
import {
  Menu,
  X,
  BookOpen,
  Users,
  MessageCircle,
  ShoppingBag,
  Rose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Link, useLocation } from "@tanstack/react-router";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background backdrop-blur supports-backdrop-filter:bg-background/90">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Rose className="size-8" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text">
              SeRena Cosméticos
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/">
              <Button
                variant="ghost"
                className={`hover:text-primary transition-colors ${
                  isActiveRoute("/") ? "text-primary font-semibold" : ""
                }`}
              >
                Início
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="ghost"
                className={`hover:text-primary transition-colors flex items-center gap-2 ${
                  isActiveRoute("/products") ? "text-primary font-semibold" : ""
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Produtos
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                className={`hover:text-primary transition-colors flex items-center gap-2 ${
                  isActiveRoute("/about") ? "text-primary font-semibold" : ""
                }`}
              >
                <Users className="w-4 h-4" />
                Sobre
              </Button>
            </Link>
            <Link to="/flipbook">
              <Button
                variant="ghost"
                className={`hover:text-primary transition-colors flex items-center gap-2 ${
                  isActiveRoute("/flipbook") ? "text-primary font-semibold" : ""
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Catálogo
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="ghost"
                className={`hover:text-primary transition-colors flex items-center gap-2 ${
                  isActiveRoute("/contact") ? "text-primary font-semibold" : ""
                }`}
              >
                <MessageCircle className="w-4 h-4" />
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
                  variant="ghost"
                  className={`text-left hover:text-primary transition-colors justify-start ${
                    isActiveRoute("/") ? "text-primary font-semibold" : ""
                  }`}
                >
                  Início
                </Button>
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`text-left hover:text-primary transition-colors justify-start flex items-center gap-2 ${
                    isActiveRoute("/products")
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Produtos
                </Button>
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`text-left hover:text-primary transition-colors justify-start flex items-center gap-2 ${
                    isActiveRoute("/about") ? "text-primary font-semibold" : ""
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Sobre
                </Button>
              </Link>
              <Link to="/flipbook" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`text-left hover:text-primary transition-colors justify-start flex items-center gap-2 ${
                    isActiveRoute("/flipbook")
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Catálogo
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`text-left hover:text-primary transition-colors justify-start flex items-center gap-2 ${
                    isActiveRoute("/contact")
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
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
