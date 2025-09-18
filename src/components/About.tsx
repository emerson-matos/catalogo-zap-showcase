import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Target } from "lucide-react";

const About = ({ sectionId }: { sectionId: string }) => {
  return (
    <section id={sectionId} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Quem Somos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça a história e os valores da SeRena Cosméticos, uma empresa 
            dedicada à beleza e ao bem-estar das pessoas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* História */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-4">Nossa História</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      A SeRena Cosméticos nasceu da paixão pela beleza e do desejo de 
                      proporcionar produtos de qualidade para nossos clientes. 
                      Fundada com valores cristãos, nossa empresa acredita que 
                      "Tudo posso naquele que me fortalece" e que "Deus é fiel".
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Estamos localizados em Santo André, SP, e atendemos toda a 
                      região metropolitana com produtos cosméticos cuidadosamente 
                      selecionados para atender às necessidades de cada cliente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Valores */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-4">Nossa Missão</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Oferecer produtos cosméticos de alta qualidade, proporcionando 
                      bem-estar e autoestima aos nossos clientes, sempre com 
                      atendimento personalizado e valores cristãos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-4">Nossos Valores</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• Fé e confiança em Deus</li>
                      <li>• Qualidade em todos os produtos</li>
                      <li>• Atendimento personalizado</li>
                      <li>• Transparência e honestidade</li>
                      <li>• Compromisso com o cliente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Qualidade Garantida</h3>
              <p className="text-muted-foreground">
                Produtos selecionados com rigoroso controle de qualidade
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Atendimento Personalizado</h3>
              <p className="text-muted-foreground">
                Cada cliente é único e recebe atenção especial
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Experiência Cristã</h3>
              <p className="text-muted-foreground">
                Valores cristãos em todos os nossos relacionamentos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;