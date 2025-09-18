import { Heart, Users, Award, Star } from "lucide-react";

const AboutSection = ({ sectionId }: { sectionId: string }) => {
  return (
    <section
      id={sectionId}
      className="py-20 bg-gradient-to-b from-background to-secondary/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Quem Somos
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-lg leading-relaxed text-muted-foreground">
              <p className="mb-4">
                A <strong>SeRena Cosméticos</strong> nasceu com a missão de levar 
                produtos de qualidade para saúde e beleza até você. Acreditamos que 
                cuidar de si mesmo é um ato de amor e autoestima.
              </p>
              <p className="mb-4">
                Nossa filosofia é simples: <em>"Tudo posso naquele que me fortalece. 
                Deus é fiel!"</em> - uma mensagem que reflete nossa dedicação e 
                compromisso com cada cliente.
              </p>
              <p>
                Oferecemos uma seleção cuidadosa de produtos que combinam qualidade, 
                eficácia e acessibilidade, sempre pensando no seu bem-estar e na sua 
                satisfação.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Amor ao Cliente</h3>
                <p className="text-sm text-muted-foreground">
                  Cada produto é selecionado com carinho para você
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Produtos testados e aprovados pelos nossos clientes
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
              <p className="text-muted-foreground leading-relaxed">
                Proporcionar produtos de qualidade que ajudem você a se sentir 
                bem consigo mesmo, promovendo autoestima e bem-estar através 
                de cuidados com a saúde e beleza.
              </p>
              <div className="flex justify-center mt-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Clientes satisfeitos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;