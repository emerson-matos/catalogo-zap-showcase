import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import FlipbookGrid from "@/components/FlipbookGrid";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <FlipbookGrid sectionId="products-flipbook" />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Products;