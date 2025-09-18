import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FlipbookProductViewer from "@/components/FlipbookProductViewer";

export const Flipbook = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <FlipbookProductViewer />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};