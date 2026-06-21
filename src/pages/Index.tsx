import LuxuryNav from "@/components/LuxuryNav";
import HeroSection from "@/components/HeroSection";
import CollectionGrid from "@/components/CollectionGrid";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import BrandStory from "@/components/BrandStory";
import FeaturesGrid from "@/components/FeaturesGrid";
import LuxuryFooter from "@/components/LuxuryFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />
      <HeroSection />
      <CraftsmanshipSection />
      <BrandStory />
      <FeaturesGrid />
      <LuxuryFooter />
    </div>
  );
};

export default Index;
