import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Star, Award } from "lucide-react";

const About = ({ sectionId }: { sectionId: string }) => {
  return (
    <section id={sectionId} className="py-20 bg-card text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Quem Somos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça a história e os valores da SeRena Cosméticos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* História */}
          <div className="space-y-6">
            <Card className="bg-card shadow-lg border border-border">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-4">Nossa História</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      A SeRena Cosméticos nasceu com o propósito de oferecer produtos 
                      de qualidade para realçar a beleza natural de cada pessoa. 
                      Fundada com amor e dedicação, nossa empresa acredita que a 
                      beleza vem de dentro para fora.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">"Tudo posso naquele que me fortalece. Deus é fiel!"</strong> - 
                      Esta é a nossa inspiração diária para continuar oferecendo 
                      o melhor em cosméticos e atendimento.
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
                        <span>Transparência e confiança</span>
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

        {/* Diferenciais */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Atendimento Personalizado</h3>
              <p className="text-muted-foreground text-sm">
                Cada cliente é único. Oferecemos consultoria personalizada para 
                encontrar os produtos ideais para você.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-accent/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Produtos de Qualidade</h3>
              <p className="text-muted-foreground text-sm">
                Selecionamos cuidadosamente cada produto, garantindo qualidade 
                e eficácia para nossos clientes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card text-center">
            <CardContent className="p-6">
              <div className="bg-primary/10 p-4 rounded-lg w-fit mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Paixão pelo que Fazemos</h3>
              <p className="text-muted-foreground text-sm">
                Amamos cosméticos e acreditamos no poder da beleza para 
                aumentar a autoestima e confiança.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;