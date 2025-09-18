import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Star } from "lucide-react";

const About = ({ sectionId }: { sectionId: string }) => {
  return (
    <section id={sectionId} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Quem Somos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça a história da SeRena Cosméticos e nossa paixão por produtos de qualidade
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
                      A SeRena Cosméticos nasceu da paixão por produtos de beleza e cuidado pessoal 
                      de qualidade. Fundada com o propósito de oferecer cosméticos que realçam a 
                      beleza natural de cada pessoa, nossa empresa tem crescido com base na confiança 
                      e satisfação de nossos clientes.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Localizada em Santo André, SP, atendemos toda a região do ABC Paulista e 
                      também realizamos entregas para todo o Brasil, sempre mantendo nosso compromisso 
                      com a excelência e qualidade dos produtos.
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
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-4">Nossos Valores</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Qualidade em todos os produtos</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Atendimento personalizado</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Confiança e transparência</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Compromisso com a satisfação do cliente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Destaques */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Clientes Satisfeitos</h3>
              <p className="text-muted-foreground">
                Mais de mil clientes atendidos com produtos de qualidade e atendimento diferenciado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-accent/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Produtos Selecionados</h3>
              <p className="text-muted-foreground">
                Trabalhamos apenas com marcas reconhecidas e produtos de alta qualidade
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Paixão pela Beleza</h3>
              <p className="text-muted-foreground">
                Acreditamos que cada pessoa merece se sentir bonita e confiante
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;