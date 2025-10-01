import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { getWhatsAppNumber } from "@/lib/whatsapp";
import { ContactCard } from "@/components/ContactCard";
import { getContactCardsData, getAdditionalCardsData } from "@/constants/contactData";

const Contact = ({ sectionId }: { sectionId: string }) => {
  const whatsappNumber = getWhatsAppNumber();
  const contactCards = getContactCardsData(whatsappNumber);
  const additionalCards = getAdditionalCardsData();

  return (
    <section id={sectionId} className="py-20 bg-card text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através do
            WhatsApp ou outros canais
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Informações de Contato */}
          <div className="space-y-6">
            {contactCards.map((card) => (
              <ContactCard key={card.title} {...card} />
            ))}
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-6">
            {additionalCards.map((card) => (
              <ContactCard key={card.title} {...card} />
            ))}

            <Card className="bg-primary text-primary-foreground shadow-lg border border-border">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-xl mb-3">Pronto para Comprar?</h3>
                <p className="mb-6 opacity-90">
                  Clique no botão abaixo e fale conosco agora mesmo!
                </p>
                <WhatsAppButton className="w-full sm:w-auto px-6 py-2">
                  Falar no WhatsApp
                </WhatsAppButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
