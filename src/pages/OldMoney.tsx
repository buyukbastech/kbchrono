import LuxuryNav from "@/components/LuxuryNav";
import LuxuryFooter from "@/components/LuxuryFooter";
import CollectionGrid from "@/components/CollectionGrid";
import { useEffect } from "react";

const OldMoney = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <LuxuryNav />
      <div className="pt-32 pb-12 px-6">
        <h1 className="text-4xl md:text-5xl text-gradient-gold font-bold tracking-[0.2em] uppercase text-center">Old Money</h1>
      </div>
      <CollectionGrid fixedCollection="Old Money" />
      <LuxuryFooter />
    </div>
  );
};

export default OldMoney;
