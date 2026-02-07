import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GenerationStudio from "@/components/GenerationStudio";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background gradient-mesh">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <div id="create">
          <GenerationStudio />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
