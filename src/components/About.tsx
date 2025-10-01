import { Award, Heart, Star, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const About = ({ sectionId }: { sectionId: string }) => {
  return (
    <section id={sectionId}>
      <div className="mx-auto container px-4 py-8">
        <div className="text-center m-12">
          <h2 className="text-4xl font-bold mb-4">Quem Somos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça a história e os valores da SeRena Cosméticos
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* História */}
            <Card>
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="p-3 rounded-lg">
                  <Heart className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-4">Nossa História</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    A SeRena Cosméticos nasceu com o propósito de oferecer
                    produtos de qualidade para realçar a beleza natural de cada
                    pessoa. Fundada com amor e dedicação, nossa empresa acredita
                    que a beleza vem de dentro para fora.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">
                      "Tudo posso naquele que me fortalece. Deus é fiel!"
                    </strong>{" "}
                    - Esta é a nossa inspiração diária para continuar oferecendo
                    o melhor em cosméticos e atendimento.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card>
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="p-3 rounded-lg">
                  <Star className="size-6" />
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
              </CardContent>
            </Card>
          </div>

          {/* Diferenciais */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card>
              <CardContent className="p-6">
                <div className="p-4 rounded-lg w-fit mx-auto mb-4">
                  <Users className="size-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Atendimento Personalizado
                </h3>
                <p className="text-muted-foreground text-sm">
                  Cada cliente é único. Oferecemos consultoria personalizada
                  para encontrar os produtos ideais para você.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="p-4 rounded-lg w-fit mx-auto mb-4">
                  <Award className="size-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Produtos de Qualidade
                </h3>
                <p className="text-muted-foreground text-sm">
                  Selecionamos cuidadosamente cada produto, garantindo qualidade
                  e eficácia para nossos clientes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="p-4 rounded-lg w-fit mx-auto mb-4">
                  <Heart className="size-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Paixão pelo que Fazemos
                </h3>
                <p className="text-muted-foreground text-sm">
                  Amamos cosméticos e acreditamos no poder da beleza para
                  aumentar a autoestima e confiança.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

