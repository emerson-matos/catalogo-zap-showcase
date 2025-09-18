import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Target, MessageCircle, Package } from "lucide-react";

const About = ({ sectionId }: { sectionId: string }) => {
  return (
    <section id={sectionId} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Quem Somos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça a história e os valores da SeRena Cosméticos, uma empresa dedicada 
            a oferecer produtos de qualidade e atendimento personalizado.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* História */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Nossa História</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A SeRena Cosméticos nasceu da paixão por cosméticos e do desejo de 
                oferecer produtos de qualidade para nossos clientes. Fundada com base 
                nos valores cristãos e na fé em Deus, nossa empresa tem como lema 
                "Tudo posso naquele que me fortalece".
              </p>
              <p>
                Localizada em Santo André, SP, trabalhamos com dedicação para 
                proporcionar uma experiência única de compra, combinando produtos 
                selecionados com atendimento personalizado via WhatsApp.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Paixão</h4>
                <p className="text-sm text-muted-foreground">
                  Amor genuíno pelos cosméticos e pelo que fazemos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Atendimento</h4>
                <p className="text-sm text-muted-foreground">
                  Relacionamento próximo e personalizado com cada cliente
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Qualidade</h4>
                <p className="text-sm text-muted-foreground">
                  Produtos selecionados com rigor e cuidado
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Missão</h4>
                <p className="text-sm text-muted-foreground">
                  Realizar sonhos através da beleza e autoestima
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Nossos Diferenciais</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Atendimento via WhatsApp</h4>
              <p className="text-sm text-muted-foreground">
                Comunicação rápida e direta para tirar suas dúvidas e realizar pedidos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Produtos Selecionados</h4>
              <p className="text-sm text-muted-foreground">
                Catálogo cuidadosamente escolhido com produtos de qualidade comprovada
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Valores Cristãos</h4>
              <p className="text-sm text-muted-foreground">
                Empresa fundamentada na fé e nos princípios cristãos de honestidade e amor
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;