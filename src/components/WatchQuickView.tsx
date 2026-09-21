import { ArrowLeft, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { Link } from "react-router-dom";

export default function WatchQuickView({ watch, onClose }: { watch: any, onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const { translated } = useAutoTranslate({
    name: watch.name || "", 
    collection: watch.collection || "", 
    tagline: watch.tagline || ""
  });
  const name = i18n.language === "tr" ? watch.name : (watch.is_from_db ? translated.name || watch.name : t(`watches.${watch.id}.name`, { defaultValue: watch.name }));
  const col  = i18n.language === "tr" ? watch.collection : (watch.is_from_db ? translated.collection || watch.collection : t(`watches.${watch.id}.collection`, { defaultValue: watch.collection }));

  const formattedPrice = watch.price ? (() => {
    const clean = String(watch.price).replace(/[₺$\s.]/g, '');
    const formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${formatted}`;
  })() : '';

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black animate-in fade-in zoom-in-95 duration-300">
      
      {/* Background & Main Image */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-20">
        <img src={watch.image} alt={name} className="w-full h-full object-contain" />
      </div>
      
      {/* Close / Back button */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
         <button onClick={onClose} className="flex items-center gap-2 text-white/70 hover:text-white text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-colors">
           <ArrowLeft size={16} /> {t("common.back", "BACK TO COLLECTION")}
         </button>
         <button onClick={onClose} className="text-white/70 hover:text-white p-2">
           <X size={24} />
         </button>
      </div>

      {/* Top Info Box */}
      <div className="absolute top-16 left-4 sm:left-8 bg-black/90 backdrop-blur-xl p-4 sm:p-6 rounded-xl border border-white/10 max-w-[85vw] sm:max-w-md z-10 shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <p className="text-[9px] tracking-[0.3em] uppercase text-gradient-gold mb-2">{col}</p>
        <h2 className="text-lg sm:text-xl font-semibold text-white leading-tight">{name}</h2>
      </div>

      {/* Bottom Action Box */}
      <div className="absolute bottom-6 right-4 sm:right-8 bg-black/90 backdrop-blur-xl p-4 sm:p-6 rounded-xl border border-white/10 w-[calc(100%-2rem)] sm:w-80 z-10 shadow-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {formattedPrice && (
          <div className="text-lg font-bold text-gradient-gold mb-4">
            {formattedPrice}
          </div>
        )}
        <a
          href={`https://wa.me/905306044763?text=${encodeURIComponent(`I want to request information about ${name}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-gold text-primary-foreground py-3.5 text-[10px] tracking-[0.2em] uppercase font-bold text-center rounded-sm hover:opacity-90 transition-opacity"
        >
          {t("common.requestInfo", "REQUEST INFORMATION")}
        </a>
        <Link to={`/watch/${watch.id}`} className="block text-center mt-4 text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white underline transition-colors">
          View Full Details
        </Link>
      </div>

    </div>
  );
}
