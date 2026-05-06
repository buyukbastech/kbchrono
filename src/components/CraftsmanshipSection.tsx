import craftsmanship from "@/assets/craftsmanship.jpg";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

const CraftsmanshipSection = () => {
  const ref = useReveal();
  const { t } = useTranslation();

  return (
    <section id="craftsmanship" className="relative py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="relative overflow-hidden reveal">
            <img
              src={craftsmanship}
              alt="Master watchmaker at work"
              loading="lazy"
              width={1920}
              height={1080}
              className="w-full h-[500px] lg:h-[700px] object-cover"
            />
            <div className="absolute inset-0 border border-primary/10" />
          </div>

          {/* Text */}
          <div className="space-y-8">
            <p className="text-primary text-xs tracking-[0.4em] uppercase reveal">
              {t("craftsmanship.subtitle")}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight reveal reveal-delay-1">
              {t("craftsmanship.title").split(",").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h2>
            <div className="luxury-line w-16 reveal reveal-delay-2" />
            <p className="text-muted-foreground leading-relaxed reveal reveal-delay-2">
              {t("craftsmanship.description1")}
            </p>
            <p className="text-muted-foreground leading-relaxed reveal reveal-delay-3">
              {t("craftsmanship.description2")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4 reveal reveal-delay-4">
              {[
                { value: t("craftsmanship.stats.value1") },
                { value: t("craftsmanship.stats.value2") },
                { value: t("craftsmanship.stats.value3") },
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-xl md:text-2xl font-bold text-gradient-gold">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
