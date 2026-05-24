import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { watches } from "@/data/watches";
import { supabase } from "@/lib/supabase";
import LuxuryNav from "@/components/LuxuryNav";
import LuxuryFooter from "@/components/LuxuryFooter";
import { useReveal } from "@/hooks/useReveal";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const WatchDetail = () => {
  const { id } = useParams();
  const [watch, setWatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const ref = useReveal();
  const { t, i18n } = useTranslation();

  // ── Load product from Supabase (or local fallback) ────────────────────────
  useEffect(() => {
    async function getWatch() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("slug", id)
          .single();

        if (data) {
          setWatch({
            id: data.id,
            name: data.name,
            collection: data.collection,
            tagline: data.tagline,
            description: data.description,
            price: data.price,
            image: data.image,
            images: data.images,
            specs: {
              movement: data.movement,
              case_material: data.case_material,
              case_size: data.case_size,
              water_resistance: data.water_resistance,
              power_reserve: data.power_reserve,
              crystal: data.crystal,
            },
            story: data.story || data.description,
            is_from_db: true,
            views_count: data.views_count || 0,
          });

          supabase
            .rpc("increment_views", { product_id: data.id })
            .then(({ error: rpcError }) => {
              if (rpcError) {
                supabase
                  .from("products")
                  .update({ views_count: (data.views_count || 0) + 1 })
                  .eq("id", data.id);
              }
            });

          setLoading(false);
          return;
        }
      } catch {
        // fall through to local
      }

      const local = watches.find((w) => w.id === id);
      if (local) setWatch({ ...local, slug: local.id });
      setLoading(false);
    }
    getWatch();
  }, [id]);

  // ── Auto-translate all text content ──────────────────────────────────────
  // Build translatable content object from watch data (always from Turkish source)
  const translatableContent = watch
    ? {
        name: watch.name || "",
        collection: watch.collection || "",
        description: watch.description || "",
        tagline: watch.tagline || "",
        // specs
        movement: watch.specs?.movement || "",
        case_material: watch.specs?.case_material || "",
        water_resistance: watch.specs?.water_resistance || "",
        power_reserve: watch.specs?.power_reserve || "",
        crystal: watch.specs?.crystal || "",
      }
    : {};

  const { translated, isTranslating } = useAutoTranslate(translatableContent);

  // ── Helper: get translated value, fallback to static i18n, then Turkish ──
  const getVal = (field: string, fallback: string): string => {
    const lang = i18n.language;
    if (lang === "tr") return fallback;

    // 1. Auto-translated value (from hook)
    const auto = (translated as any)[field];
    if (auto && auto !== fallback) return auto;

    // 2. Static i18n config (built-in products)
    const staticKey = `watches.${id}.${field}`;
    const staticVal = t(staticKey);
    if (staticVal !== staticKey) return staticVal;

    // 3. Turkish fallback
    return fallback;
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="text-muted-foreground animate-pulse">Eser yükleniyor...</p>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t("common.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" ref={ref}>
      <LuxuryNav />

      {/* Translation indicator */}
      {isTranslating && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-md border border-gold/30 text-gold text-xs px-4 py-2 rounded-full shadow-lg">
          <Loader2 className="h-3 w-3 animate-spin" />
          {i18n.language === "ar" ? "جارٍ الترجمة..." : "Translating..."}
        </div>
      )}

      {/* Hero */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.2em] uppercase hover:text-foreground transition-colors"
          >
            <ArrowLeft
              size={14}
              className={i18n.language === "ar" ? "rotate-180" : ""}
            />
            {t("common.back")}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          {/* Image / Carousel */}
          <div className="relative overflow-hidden bg-card aspect-square lg:aspect-auto lg:h-[90vh] sticky top-0 z-10">
            {watch.images && watch.images.length > 0 ? (
              <div className="embla h-full w-full" ref={emblaRef} dir="ltr">
                <div
                  className="embla__container h-full w-full flex"
                  style={{ direction: "ltr" }}
                >
                  {watch.images.map((img: string, idx: number) => (
                    <div
                      className="embla__slide flex-[0_0_100%] h-full min-w-0"
                      key={idx}
                    >
                      <img
                        src={img}
                        alt={`${watch.name} - ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10"
                  dir="ltr"
                >
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    className="h-10 w-10 flex items-center justify-center rounded-full glass hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    className="h-10 w-10 flex items-center justify-center rounded-full glass hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <img
                src={watch.image}
                alt={watch.name}
                width={800}
                height={1000}
                className="w-full h-full object-cover animate-fade-in"
              />
            )}
          </div>

          {/* Info */}
          <div className="px-6 lg:px-16 py-16 lg:py-24 flex flex-col justify-center">
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 reveal">
              {getVal("collection", watch.collection)}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 reveal reveal-delay-1">
              {getVal("name", watch.name)}
            </h1>
            <div className="luxury-line w-16 mb-8 reveal reveal-delay-2" />
            <p className="text-muted-foreground leading-relaxed mb-12 reveal reveal-delay-3">
              {getVal("description", watch.description)}
            </p>

            <p className="text-2xl font-bold text-gradient-gold mb-12 reveal reveal-delay-3">
              {watch.price ? (() => {
                const clean = watch.price.replace(/[₺$\s.]/g, '');
                const formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                return `$ ${formatted}`; // "Quiet Luxury" için hafif boşluklu lüks format: $ 48.500
              })() : ''}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-4">
              <a
                href="https://wa.me/905306044763"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-gold text-primary-foreground px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity duration-300 text-center"
              >
                {t("common.requestInfo")}
              </a>
              <a
                href="https://wa.me/905306044763"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary/30 text-foreground px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:border-primary/60 transition-colors duration-300 text-center"
              >
                {t("common.bookViewing")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-32 px-6 lg:px-12 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 reveal">
              {t("common.specs")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight reveal reveal-delay-1">
              {t("common.engineering")}
            </h2>
            <div className="luxury-line w-24 mx-auto mt-8 reveal reveal-delay-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {Object.entries(watch.specs).map(([key, value], i) => (
              <div
                key={key}
                className={`bg-background p-8 reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-3">
                  {t(`common.specLabels.${key}`, {
                    defaultValue: key.replace(/_/g, " "),
                  })}
                </p>
                <p className="text-foreground font-medium">
                  {getVal(key, value as string)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
};

export default WatchDetail;
