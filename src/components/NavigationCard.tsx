import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  to?: string;
  dialogContent?: ReactNode;
  whatsappMessage?: string;
}

export const NavigationCard = ({
  title,
  description,
  icon: Icon,
  buttonText,
  to,
  dialogContent,
  whatsappMessage,
}: NavigationCardProps) => {
  const cardContent = (
    <div className="bg-gradient-card shadow-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
      <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-semibold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground mb-4 text-sm flex-grow">
        {description}
      </p>

      <div className="mt-auto">
        {dialogContent ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">{dialogContent}</DialogContent>
          </Dialog>
        ) : whatsappMessage ? (
          <WhatsAppButton
            variant="outline"
            className="w-full"
            message={whatsappMessage}
          >
            {buttonText}
          </WhatsAppButton>
        ) : (
          <Button variant="outline" className="w-full">
            {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );

  if (to && !dialogContent) {
    return (
      <Link href={to} className="h-full block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
