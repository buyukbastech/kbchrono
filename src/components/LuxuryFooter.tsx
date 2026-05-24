import { useTranslation } from "react-i18next";

const LuxuryFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <img src="/kb-logo.png" alt="kbchrono" className="h-16 w-auto" />
              <p className="text-gradient-gold text-xl font-bold tracking-[0.3em] uppercase">
                kbchrono
              </p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              {t("footer.explore")}
            </p>
            <div className="space-y-3">
              {[
                { label: t("nav.collections"), href: "/collections" },
                { label: t("nav.craftsmanship"), href: "/#craftsmanship" },
                { label: t("nav.story"), href: "/#story" },
                { label: t("footer.boutiques"), href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="luxury-line mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-xs">
          <p>{t("footer.rights")}</p>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/chrono.kb/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300 tracking-[0.1em] uppercase"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;
