import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

export const NavItem = ({
  to,
  label,
  icon: Icon,
  isActive,
  isMobile = false,
  onClick,
}: NavItemProps) => {
  const baseClasses = "hover:text-primary transition-colors";
  const activeClasses = isActive ? "text-primary font-semibold" : "";
  
  const mobileClasses = isMobile 
    ? "text-left justify-start flex items-center gap-2" 
    : "flex items-center gap-2";

  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant="ghost"
        className={`${baseClasses} ${activeClasses} ${mobileClasses}`}
      >
        <Icon className="size-4" />
        {label}
      </Button>
    </Link>
  );
};
