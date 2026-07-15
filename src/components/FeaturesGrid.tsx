import { Rocket, Truck, Banknote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";

const FeaturesGrid = () => {
  const { t } = useTranslation();
  const revealRef = useReveal();

  const features = [
    {
      icon: <Banknote className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-md" strokeWidth={1} />,
      title: t("features.cashOnDelivery", "Cash On Delivery"),
      subtext: t("features.codSubtext", "(Only in Dubai)")
    },
    {
      icon: <Rocket className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-md" strokeWidth={1} />,
      title: t("features.fastDelivery", "Fast Delivery"),
    },
    {
      icon: <Truck className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-md" strokeWidth={1} />,
      title: t("features.freeShipping", "Free Shipping"),
    }
  ];

  return (
    <section className="py-24 bg-background px-6 lg:px-12" ref={revealRef}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`group luxury-border-glow rounded-sm flex flex-col items-center justify-center p-12 md:p-16 border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 reveal reveal-delay-${idx + 1}`}
            >
              {feature.icon}
              <h3 className="text-foreground text-lg font-bold tracking-widest uppercase text-center font-sans">
                {feature.title}
              </h3>
              {feature.subtext && (
                <p className="text-muted-foreground text-sm mt-3 font-light tracking-wide text-center font-sans">
                  {feature.subtext}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
