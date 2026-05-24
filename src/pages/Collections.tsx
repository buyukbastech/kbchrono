import CollectionsHeader from "@/components/CollectionsHeader";
import CollectionGrid from "@/components/CollectionGrid";
import LuxuryFooter from "@/components/LuxuryFooter";
import { useEffect } from "react";

const Collections = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <CollectionsHeader />
      <CollectionGrid />
      <LuxuryFooter />
    </div>
  );
};

export default Collections;
