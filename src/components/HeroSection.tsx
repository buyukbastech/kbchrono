import heroWatch from "@/assets/hero-watch.jpg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t, i18n } = useTranslation();

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroWatch}
          alt="Kunkor luxury timepiece"
          width={1920}
          height={1080}
          className="w-full h-full object-cover scale-110 animate-[scale-in_2s_ease-out_forwards]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p
          className="text-primary text-xs tracking-[0.4em] uppercase mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {t("hero.subtitle")}
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1] md:leading-[0.95] mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          {i18n.language === "en" ? (
            <>
              Engineered for
              <br className="hidden sm:block" />
              <span className="text-gradient-gold"> Excellence</span>
            </>
          ) : i18n.language === "tr" ? (
            <>
              Mükemmellik İçin
              <br className="hidden sm:block" />
              <span className="text-gradient-gold"> Tasarlandı</span>
            </>
          ) : (
            <>
              هندسة من أجل
              <br className="hidden sm:block" />
              <span className="text-gradient-gold"> التميز</span>
            </>
          )}
        </h1>
        <p
          className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-xl mx-auto mb-12 px-4 sm:px-0 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.9s" }}
        >
          {t("hero.description")}
        </p>
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: "1.1s" }}>
          <a
            href="/collections"
            className="inline-block bg-gradient-gold text-primary-foreground px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity duration-300"
          >
            {t("hero.cta")}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "2s" }}>
        <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent animate-float" />
      </div>
    </section>
  );
};

export default HeroSection;
