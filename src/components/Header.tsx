import React, { useState, useCallback, useMemo } from "react";
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
import type { NavigationItem } from "@/types/ui";

interface HeaderProps {
  readonly className?: string;
}

const Header = React.memo(({ className }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const navigationItems: readonly NavigationItem[] = useMemo(() => [
    {
      id: 'home',
      label: 'Início',
      href: '/',
    },
    {
      id: 'products',
      label: 'Produtos',
      href: '/products',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      id: 'about',
      label: 'Sobre',
      href: '/about',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'flipbook',
      label: 'Catálogo',
      href: '/flipbook',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'contact',
      label: 'Contato',
      href: '/contact',
      icon: <MessageCircle className="w-4 h-4" />,
    },
  ], []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full border-b border-border bg-background backdrop-blur supports-backdrop-filter:bg-background/90 ${className ?? ''}`}>
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
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <Link key={item.id} to={item.href}>
                <Button
                  variant="ghost"
                  className={`hover:text-primary transition-colors ${
                    item.icon ? 'flex items-center gap-2' : ''
                  } ${
                    isActiveRoute(item.href) ? "text-primary font-semibold" : ""
                  }`}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
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
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
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
          <div 
            id="mobile-navigation"
            className="md:hidden border-t border-border/40 py-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link key={item.id} to={item.href} onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className={`text-left hover:text-primary transition-colors justify-start ${
                      item.icon ? 'flex items-center gap-2' : ''
                    } ${
                      isActiveRoute(item.href) ? "text-primary font-semibold" : ""
                    }`}
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
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
});

Header.displayName = 'Header';

export default Header;
