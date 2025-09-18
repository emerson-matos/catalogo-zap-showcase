import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Flipbook from "@/components/Flipbook";

export const FlipbookPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Catálogo de Produtos
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore nossos produtos em um formato interativo de flipbook
            </p>
          </div>
          <Flipbook />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};