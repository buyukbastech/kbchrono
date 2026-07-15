import LuxuryNav from "@/components/LuxuryNav";
import LuxuryFooter from "@/components/LuxuryFooter";
import { useEffect } from "react";

const Jewellery = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000000" }}>
      <LuxuryNav />
      <div className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <h1 className="text-4xl md:text-5xl text-gradient-gold font-bold tracking-[0.2em] uppercase text-center">Jewellery Collection</h1>
      </div>
      <LuxuryFooter />
    </div>
  );
};

export default Jewellery;
