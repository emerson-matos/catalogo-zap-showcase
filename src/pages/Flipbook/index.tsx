import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Flipbook from "@/components/Flipbook";

const FlipbookPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Flipbook sectionId="flipbook" />
      </main>
      <Footer />
    </div>
  );
};

export default FlipbookPage;