import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { X, ShieldCheck, Clock, Banknote, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const StoreInfoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // Open modal on route change / page navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-transparent animate-in fade-in duration-500"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-popup-title"
    >
      {/* Luxury Modal Container */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-background/95 border border-white/10 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-gold" />

        {/* Header: Logo & Close */}
        <div className="flex items-center justify-between mb-6 pt-1">
          <div className="flex items-center gap-3">
            <img src="/kb-logo.png" alt="kbchrono" className="h-9 w-auto" />
            <div className="flex flex-col">
              <span className="text-gradient-gold text-xs font-bold tracking-[0.3em] uppercase">
                kbchrono
              </span>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                Haute Horlogerie
              </span>
            </div>
          </div>

          {/* Minimal Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300 cursor-pointer"
            aria-label={t("storePopup.close")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle Badge */}
        <p className="text-primary text-[10px] tracking-[0.35em] uppercase font-semibold mb-2">
          {t("storePopup.badge")}
        </p>

        {/* Main Title */}
        <h2
          id="store-popup-title"
          className="text-xl sm:text-2xl font-light tracking-wide text-foreground mb-4"
        >
          {t("storePopup.title")}
        </h2>

        {/* Quote / Announcement Box */}
        <div className="relative pl-4 py-2 my-5 border-l-2 border-primary bg-white/[0.02] rounded-r-xl">
          <p className="text-sm sm:text-base text-foreground/90 font-light leading-relaxed">
            "{t("storePopup.message")}"
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-6">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-colors group">
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🇹🇷</span>
            <span className="text-xs font-medium tracking-wider uppercase text-foreground/90">
              {t("storePopup.cities.istanbul")}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-colors group">
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🇱🇧</span>
            <span className="text-xs font-medium tracking-wider uppercase text-foreground/90">
              {t("storePopup.cities.lebanon")}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-colors group">
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🇺🇸</span>
            <span className="text-xs font-medium tracking-wider uppercase text-foreground/90">
              {t("storePopup.cities.miami")}
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 mb-8 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Clock size={18} className="text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">
              {t("storePopup.sameDayDelivery")}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Banknote size={18} className="text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">
              {t("storePopup.cashOnDelivery")}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground py-3.5 px-6 rounded-xl text-xs tracking-[0.25em] uppercase font-semibold hover:opacity-90 transition-all shadow-lg cursor-pointer"
          >
            <span>{t("nav.contact")}</span>
            <ArrowRight size={14} />
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="py-3.5 px-5 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 text-xs tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer"
          >
            {t("storePopup.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoPopup;
