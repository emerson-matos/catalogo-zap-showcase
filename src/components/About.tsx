import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Sparkles } from "lucide-react";

const About = ({ sectionId }: { sectionId: string }) => {
  return (
    <section id={sectionId} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Quem Somos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça a história e os valores da SeRena Cosméticos, uma empresa dedicada à beleza e ao bem-estar
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* História */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Nossa História</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A SeRena Cosméticos nasceu da paixão pela beleza e do desejo de oferecer produtos de qualidade 
                que realcem a beleza natural de cada pessoa. Fundada com valores cristãos e o lema 
                <strong className="text-foreground"> "Tudo posso naquele que me fortalece"</strong>, 
                nossa empresa acredita que a verdadeira beleza vem de dentro.
              </p>
              <p>
                Localizada em Santo André, SP, atendemos nossos clientes com dedicação e carinho, 
                oferecendo uma experiência única de compra e produtos cuidadosamente selecionados 
                para atender às necessidades de cada cliente.
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
                <h4 className="font-semibold mb-2">Amor</h4>
                <p className="text-sm text-muted-foreground">
                  Tratamos cada cliente com amor e respeito
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <div className="bg-accent/10 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Qualidade</h4>
                <p className="text-sm text-muted-foreground">
                  Produtos selecionados com rigor e qualidade
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
                  Atendimento personalizado e humanizado
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <div className="bg-accent/10 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Beleza</h4>
                <p className="text-sm text-muted-foreground">
                  Realçamos a beleza natural de cada pessoa
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Missão */}
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Oferecer produtos de cosméticos de alta qualidade, proporcionando uma experiência 
              única de beleza e bem-estar, sempre pautados pelos valores cristãos de amor, 
              respeito e dedicação ao próximo. Queremos que cada cliente se sinta especial 
              e confiante em sua própria beleza.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;