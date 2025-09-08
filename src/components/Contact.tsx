import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const Contact = () => {
  const whatsappUrl = createWhatsAppUrl({
    message:
      "Olá! Gostaria de entrar em contato para saber mais sobre seus produtos.",
  });

  return (
    <section id="contato" className="py-20 bg-muted/30">
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
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-whatsapp/10 p-3 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-whatsapp" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                    <p className="text-muted-foreground mb-4">
                      Atendimento rápido e personalizado via WhatsApp
                    </p>
                    <Button onClick={() => window.open(whatsappUrl, "_blank")}>
                      <MessageCircle className="w-4 h-4" />
                      Iniciar Conversa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Telefone</h3>
                    <p className="text-muted-foreground">(11) 99999-9999</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">E-mail</h3>
                    <p className="text-muted-foreground">
                      contato@catalogoplus.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Horário de Atendimento
                    </h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Segunda a Sexta: 8h às 18h</p>
                      <p>Sábado: 8h às 14h</p>
                      <p>Domingo: Plantão via WhatsApp</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Localização</h3>
                    <p className="text-muted-foreground">
                      São Paulo, SP - Brasil
                      <br />
                      Atendimento presencial sob agendamento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-card">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-xl mb-3">Pronto para Comprar?</h3>
                <p className="mb-6 opacity-90">
                  Clique no botão abaixo e fale conosco agora mesmo!
                </p>
                <Button
                  size="lg"
                  onClick={() => window.open(whatsappUrl, "_blank")}
                  className="bg-whatsapp hover:bg-whatsapp-hover"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

