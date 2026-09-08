import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { X, MapPin, Truck, Banknote, Sparkles, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const StoreInfoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // Trigger popup when navigating to any page / route change
  useEffect(() => {
    // Small delay so smooth page transition occurs first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  // Keyboard accessibility (Escape key closes popup)
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
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-popup-title"
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-zinc-950 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        {/* Close Button ('X') - Top Right */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 text-amber-400 hover:text-amber-300 hover:bg-zinc-800 border border-amber-500/20 transition-all duration-300 group cursor-pointer"
          aria-label={t("storePopup.close")}
        >
          <X size={20} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* Badge Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            {t("storePopup.badge")}
          </span>
        </div>

        {/* Modal Title */}
        <h2
          id="store-popup-title"
          className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3 flex items-center gap-2"
        >
          <Building2 size={24} className="text-amber-400 flex-shrink-0" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
            {t("storePopup.title")}
          </span>
        </h2>

        {/* Main Announcement Message */}
        <p className="text-sm sm:text-base leading-relaxed text-zinc-200 font-medium mb-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          {t("storePopup.message")}
        </p>

        {/* Location Badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-center hover:border-amber-500/40 transition-colors">
            <span className="text-xl mb-1">🇹🇷</span>
            <span className="text-xs font-semibold text-zinc-200 tracking-wide">
              {t("storePopup.cities.istanbul")}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-center hover:border-amber-500/40 transition-colors">
            <span className="text-xl mb-1">🇱🇧</span>
            <span className="text-xs font-semibold text-zinc-200 tracking-wide">
              {t("storePopup.cities.lebanon")}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-center hover:border-amber-500/40 transition-colors">
            <span className="text-xl mb-1">🇺🇸</span>
            <span className="text-xs font-semibold text-zinc-200 tracking-wide">
              {t("storePopup.cities.miami")}
            </span>
          </div>
        </div>

        {/* Features Row */}
        <div className="space-y-2.5 mb-6 text-xs sm:text-sm text-zinc-300">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 flex-shrink-0">
              <Truck size={16} />
            </div>
            <span className="font-medium text-amber-200">{t("storePopup.sameDayDelivery")}</span>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 flex-shrink-0">
              <Banknote size={16} />
            </div>
            <span className="font-medium text-amber-200">{t("storePopup.cashOnDelivery")}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            {t("storePopup.close")}
          </button>
          
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold uppercase tracking-wider transition-colors text-center"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoPopup;
