import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  content: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  cardClassName?: string;
}

export const ContactCard = ({
  icon: Icon,
  title,
  content,
}: ContactCardProps) => {
  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <div className="break-words">
              {content}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
