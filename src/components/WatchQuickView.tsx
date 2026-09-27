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

  const slides: { type: '3d' | 'image', src: string }[] = [];

  if (watch.model3d) {
    slides.push({ type: '3d', src: watch.model3d });
  }
  
  if (watch.image) {
    slides.push({ type: 'image', src: watch.image });
  }

  if (watch.images && Array.isArray(watch.images)) {
    watch.images.forEach((img: string) => {
      if (!slides.some(s => s.src === img)) {
        slides.push({ type: 'image', src: img });
      }
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

    </div>
  );
}
