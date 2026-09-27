import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import '@google/model-viewer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

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

  const slides: { type: '3d' | 'image', src: string }[] = [];

  // Default to a placeholder if no model3d is provided just to show the feature
  const model3dUrl = watch.model3d || "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  slides.push({ type: '3d', src: model3dUrl });
  
  if (watch.image) {
    slides.push({ type: 'image', src: watch.image });
  }

  if (watch.images && Array.isArray(watch.images)) {
    watch.images.forEach((img: string) => {
      slides.push({ type: 'image', src: img });
    });
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black animate-in fade-in zoom-in-95 duration-300">
      
      {/* Close / Back button */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
         <button onClick={onClose} className="flex items-center gap-2 text-white/70 hover:text-white text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-colors pointer-events-auto">
           <ArrowLeft size={16} /> {t("common.back", "BACK TO COLLECTION")}
         </button>
         <button onClick={onClose} className="text-white/70 hover:text-white p-2 pointer-events-auto">
           <X size={24} />
         </button>
      </div>

      {/* Slider */}
      <div className="flex-1 w-full relative overflow-hidden" ref={emblaRef}>
        <div className="flex h-full w-full">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative flex items-center justify-center p-4 sm:p-20">
              {slide.type === '3d' ? (
                <model-viewer
                  src={slide.src}
                  alt={name}
                  auto-rotate
                  camera-controls
                  interaction-prompt="none"
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                  disable-zoom
                />
              ) : (
                <img src={slide.src} alt={`${name} - view ${index}`} className="w-full h-full object-contain pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={scrollPrev} 
            className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 border border-white/10 rounded-full items-center justify-center text-white/70 hover:text-white transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={scrollNext} 
            className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 border border-white/10 rounded-full items-center justify-center text-white/70 hover:text-white transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Top Info Box */}
      <div className="absolute top-16 left-4 sm:left-8 bg-black/90 backdrop-blur-xl p-4 sm:p-6 rounded-xl border border-white/10 max-w-[85vw] sm:max-w-md z-10 shadow-2xl animate-fade-in pointer-events-none" style={{ animationDelay: '0.1s' }}>
        <p className="text-[9px] tracking-[0.3em] uppercase text-gradient-gold mb-2">{col}</p>
        <h2 className="text-lg sm:text-xl font-semibold text-white leading-tight">{name}</h2>
      </div>

      {/* Bottom Action Box */}
      <div className="absolute bottom-6 right-4 sm:right-8 bg-black/90 backdrop-blur-xl p-4 sm:p-6 rounded-xl border border-white/10 w-[calc(100%-2rem)] sm:w-80 z-10 shadow-2xl animate-fade-up pointer-events-auto" style={{ animationDelay: '0.2s' }}>
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
          {i18n.language === "tr" ? "Tüm Detayları Gör" : i18n.language === "ar" ? "عرض التفاصيل كاملة" : "View Full Details"}
        </Link>
      </div>

    </div>
  );
}
