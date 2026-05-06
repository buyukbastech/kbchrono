import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { watches as localWatches } from "@/data/watches";
import { supabase } from "@/lib/supabase";
import { useReveal } from "@/hooks/useReveal";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useTranslation } from "react-i18next";

// ── Single card with auto-translation ────────────────────────────────────────
function WatchCard({ watch, index }: { watch: any; index: number }) {
  const { t, i18n } = useTranslation();

  const { translated } = useAutoTranslate({
    name: watch.name || "",
    collection: watch.collection || "",
    tagline: watch.tagline || "",
  });

  const getName = () => {
    if (i18n.language === "tr") return watch.name;
    // DB product → use auto-translated
    if (watch.is_from_db) return translated.name || watch.name;
    // Local/static product → use i18n config
    return t(`watches.${watch.id}.name`, { defaultValue: watch.name });
  };

  const getCollection = () => {
    if (i18n.language === "tr") return watch.collection;
    if (watch.is_from_db) return translated.collection || watch.collection;
    return t(`watches.${watch.id}.collection`, { defaultValue: watch.collection });
  };

  return (
    <Link
      to={`/watch/${watch.id}`}
      className={`group luxury-card reveal reveal-delay-${(index % 10) + 1}`}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={watch.image}
          alt={watch.name}
          loading="lazy"
          width={800}
          height={1000}
          className="w-full h-full object-cover img-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-primary text-xs tracking-[0.3em] uppercase">
            {getCollection()}
          </span>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-semibold tracking-wide mb-2">
          {getName()}
        </h3>
      </div>
    </Link>
  );
}

// ── Main grid ─────────────────────────────────────────────────────────────────
const CollectionGrid = () => {
  const [allWatches, setAllWatches] = useState<any[]>(localWatches);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useReveal([allWatches]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchAll(isInitial = false) {
      if (isInitial) setIsLoading(true);
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("status", "yayinda");

        if (data) {
          const dbWatches = data.map((item) => ({
            id: item.slug || item.id,
            name: item.name,
            collection: item.collection,
            tagline: item.tagline,
            image: item.image,
            is_from_db: true,
          }));

          const normalize = (s: any) =>
            String(s || "")
              .toLowerCase()
              .trim()
              .replace(/[—\s_-]/g, "");
          const dbNormalizedIds = new Set(dbWatches.map((w) => normalize(w.id)));
          const uniqueLocalWatches = localWatches.filter(
            (w) => !dbNormalizedIds.has(normalize(w.id))
          );

          setAllWatches([...dbWatches, ...uniqueLocalWatches]);
        }
      } catch (err) {
        console.error("Error fetching db watches:", err);
      } finally {
        if (isInitial) setIsLoading(false);
      }
    }

    fetchAll(true);

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        },
        () => {
          fetchAll(false); // Update in background when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="collections" className="py-32 px-6 lg:px-12" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 reveal">
            {t("nav.collections")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight reveal reveal-delay-1">
            {t("collectionGrid.title")}
          </h2>
          <div className="luxury-line w-24 mx-auto mt-8 reveal reveal-delay-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 min-h-[400px]">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse tracking-widest uppercase text-xs">
                Koleksiyonlar Yükleniyor...
              </p>
            </div>
          ) : (
            allWatches.map((watch: any, i) => (
              <WatchCard key={watch.id} watch={watch} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;
