import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

const ContactCTA = () => {
  const ref = useReveal();
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-12" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 reveal">
          {t("contact.subtitle")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 reveal reveal-delay-1">
          {t("contact.title")}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-12 reveal reveal-delay-2">
          {t("contact.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center reveal reveal-delay-3">

          <a
            href="/collections"
            className="border border-primary/30 text-foreground px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:border-primary/60 transition-colors duration-300"
          >
            {t("contact.discover")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
