import { useState, useCallback, useMemo } from "react";
import {
  Menu,
  X,
  BookOpen,
  Users,
  MessageCircle,
  ShoppingBag,
  Rose,
  HomeIcon,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Link, useLocation } from "@tanstack/react-router";

interface NavigationItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { to: "/", label: "Início", icon: HomeIcon },
  { to: "/products", label: "Produtos", icon: ShoppingBag },
  { to: "/about", label: "Sobre", icon: Users },
  { to: "/flipbook", label: "Revista Digital", icon: BookOpen },
  { to: "/contact", label: "Contato", icon: MessageCircle },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActiveRoute = useCallback((path: string): boolean => {
    return location.pathname === path;
  }, [location.pathname]);

  const NavLink = useMemo(() => {
    return ({ item }: { item: NavigationItem }) => {
      const Icon = item.icon;
      return (
        <Link to={item.to}>
          <Button
            variant="ghost"
            className={`hover:text-primary transition-colors flex items-center gap-2 ${
              isActiveRoute(item.to) ? "text-primary font-semibold" : ""
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Button>
        </Link>
      );
    };
  }, [isActiveRoute]);

  const MobileNavLink = useMemo(() => {
    return ({ item }: { item: NavigationItem }) => {
      const Icon = item.icon;
      return (
        <Link to={item.to} onClick={() => setIsMenuOpen(false)}>
          <Button
            variant="ghost"
            className={`text-left hover:text-primary transition-colors justify-start flex items-center gap-2 ${
              isActiveRoute(item.to) ? "text-primary font-semibold" : ""
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Button>
        </Link>
      );
    };
  }, [isActiveRoute]);

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
            {navigationItems.map((item) => (
              <NavLink key={item.to} item={item} />
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
              {navigationItems.map((item) => (
                <MobileNavLink key={item.to} item={item} />
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
};

export default Header;
