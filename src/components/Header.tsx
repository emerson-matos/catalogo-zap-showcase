"use client";

import { useState } from "react";
import { Menu, X, Rose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/components/NavItem";
import { navigationItems } from "@/constants/navigationItems";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (path: string) => {
    return pathname === path;
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
            {navigationItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                isActive={isActiveRoute(item.to)}
              />
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
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActiveRoute(item.to)}
                  isMobile={true}
                  onClick={() => setIsMenuOpen(false)}
                />
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
