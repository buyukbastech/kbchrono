import LuxuryNav from "@/components/LuxuryNav";
import CollectionGrid from "@/components/CollectionGrid";
import LuxuryFooter from "@/components/LuxuryFooter";
import { useEffect } from "react";

const Collections = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />
      <div className="pt-20">
        <CollectionGrid />
      </div>
      <LuxuryFooter />
    </div>
  );
};

export default Collections;
