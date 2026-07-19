import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { watches as localWatches } from "@/data/watches";
import { supabase } from "@/lib/supabase";
import { useReveal } from "@/hooks/useReveal";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useTranslation } from "react-i18next";
import { ChevronDown, X } from "lucide-react";

type FilterKey = "collection" | "model" | "concept" | "range" | "type" | "material" | "color";
type FilterState = Record<FilterKey, string>;

const FILTER_DEFAULTS: FilterState = {
  collection: "All", model: "All", concept: "All", range: "All",
  type: "All", material: "All", color: "All",
};

const FILTER_LABELS: Record<FilterKey, string> = {
  collection: "Collection", model: "Model", concept: "Concept", range: "Range",
  type: "Type", material: "Material", color: "Color",
};

const FILTER_KEYS: FilterKey[] = ["collection", "model", "concept", "range", "type", "material", "color"];

const FALLBACK_OPTIONS: Record<FilterKey, string[]> = {
  collection: ["All", "Richard Mille", "Audemars Piguet", "Rolex", "Patek Philippe", "Cartier", "Jaeger LeCoultre", "Omega"],
  model:      ["All", "Aquanaut", "Ballon Bleu", "Datejust", "Day-Date", "Daytona", "GMT-Master II", "Nautilus", "Reverso", "RM 11-03", "RM 35-02", "RM 55", "RM 67-02", "Royal Oak", "Royal Oak Offshore", "Santos", "Seamaster", "Speedmaster", "Submariner", "Tank"],
  concept:    ["All", "Lifestyle", "Sports", "Aviation"],
  range:      ["All", "Erkek", "Kadın", "Unisex"],
  type:       ["All", "Automatic", "Manual Winding", "Chronograph"],
  material:   ["All", "Titanium", "Rose Gold", "Sapphire", "Carbon"],
  color:      ["All", "Green", "Blue", "Black", "Silver", "Gold"],
};

// ── Background Removal Image ──────────────────────────────────────────────────
function TransparentImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  useEffect(() => {
    if (!src) return;
    // Eğer görsel blob/data uri ise (CRM'den yeni eklendiyse) zaten şeffaftır, boşuna işlem yapma
    if (src.startsWith('data:image/webp') || src.startsWith('blob:')) {
      setImageSrc(src);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if(!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const visited = new Uint8Array(canvas.width * canvas.height);
        const stack = [
          [0, 0], [canvas.width - 1, 0], 
          [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
          [Math.floor(canvas.width/2), 0], [Math.floor(canvas.width/2), canvas.height - 1],
          [0, Math.floor(canvas.height/2)], [canvas.width - 1, Math.floor(canvas.height/2)]
        ];
        
        // EN GÜVENLİ YÖNTEM: Sadece Kusursuz Beyazı (Stüdyo) Sil (> 240).
        // Bu sayede beyaz/gri saatlerin kasası veya kenarları ASLA yenmez, saat bozulmaz.
        const isWhite = (r: number, g: number, b: number) => r > 240 && g > 240 && b > 240;
        
        while(stack.length > 0) {
          const [x, y] = stack.pop()!;
          if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
          const idx = y * canvas.width + x;
          if (visited[idx]) continue;
          
          const i = idx * 4;
          if (isWhite(data[i], data[i+1], data[i+2])) {
            visited[idx] = 1;
            data[i+3] = 0; // Şeffaf yap
            stack.push([x+1, y], [x-1, y], [x, y+1], [x, y-1]);
          }
        }
        ctx.putImageData(imageData, 0, 0);

        // --- Bounding Box Crop ---
        let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3];
            // Yarı saydam veya silik parazitleri tamamen yoksay (sadece net saati baz al)
            if (alpha > 50) { 
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (minX >= maxX || minY >= maxY) {
          setImageSrc(canvas.toDataURL());
          return;
        }

        const objW = maxX - minX;
        const objH = maxY - minY;

        const maxObjDim = Math.max(objW, objH);
        
        // EŞİT BOYUTLANDIRMA: Saatin çok büyük (şişik) görünmesini engellemek için,
        // karenin %80'ini kaplayacak şekilde %10 lüks padding ekliyoruz.
        const squareSize = maxObjDim / 0.8;
        const padding = squareSize * 0.10;

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = squareSize;
        finalCanvas.height = squareSize;
        const fCtx = finalCanvas.getContext("2d");
        
        if (fCtx) {
          fCtx.imageSmoothingEnabled = true;
          fCtx.imageSmoothingQuality = 'high';
        }

        const dx = padding + (maxObjDim - objW) / 2;
        const dy = padding + (maxObjDim - objH) / 2;

        fCtx?.drawImage(canvas, minX, minY, objW, objH, dx, dy, objW, objH);
        setImageSrc(finalCanvas.toDataURL("image/webp", 1.0));
      } catch (e) {
        console.warn("Canvas background removal failed:", e);
        setImageSrc(src);
      }
    };
    img.onerror = () => setImageSrc(src);
  }, [src]);

  if (!imageSrc) return null; // İşlem bitene kadar beyaz arkaplanlı ham resmi gösterme!

  return <img src={imageSrc} alt={alt} loading="lazy" className={`${className} animate-fade-in`} />;
}

// ── Watch Card ────────────────────────────────────────────────────────────────
function WatchCard({ watch }: { watch: any }) {
  const { t, i18n } = useTranslation();
  const { translated } = useAutoTranslate({
    name: watch.name || "", collection: watch.collection || "", tagline: watch.tagline || "",
  });
  const name = i18n.language === "tr" ? watch.name : (watch.is_from_db ? translated.name || watch.name : t(`watches.${watch.id}.name`, { defaultValue: watch.name }));
  const col  = i18n.language === "tr" ? watch.collection : (watch.is_from_db ? translated.collection || watch.collection : t(`watches.${watch.id}.collection`, { defaultValue: watch.collection }));
  const tag  = i18n.language === "tr" ? watch.tagline : (watch.is_from_db ? translated.tagline || watch.tagline : t(`watches.${watch.id}.tagline`, { defaultValue: watch.tagline }));

  return (
    <Link to={`/watch/${watch.id}`} className="group block" style={{ textDecoration: "none" }}>
      {/* 1. Sabit Görüntü Kapsayıcısı (Strict Image Wrapper) & 3. Güvenli Alan ve Padding (p-8) */}
      <div className="relative w-full aspect-square flex items-center justify-center p-8 bg-transparent overflow-hidden">
        
        {/* 2. Görsel Boyutlandırma ve Sığdırma (Object-Fit & Scale Normalization) */}
        <TransparentImage 
          src={watch.image} 
          alt={name} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.07] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="pt-4 text-center px-2">
        <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-gradient-gold mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          {col}
        </p>
        <h3 className="font-semibold text-sm sm:text-base text-foreground overflow-hidden text-ellipsis whitespace-nowrap mb-1">
          {name}
        </h3>
        {tag && (
          <p className="text-[10px] sm:text-[11px] text-muted-foreground/70 overflow-hidden text-ellipsis whitespace-nowrap">
            {tag}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── Main Grid ─────────────────────────────────────────────────────────────────
export default function CollectionGrid({ fixedCollection }: { fixedCollection?: string } = {}) {
  const [allWatches, setAllWatches]         = useState<any[]>(localWatches);
  const [isLoading, setIsLoading]           = useState(true);
  const [filters, setFilters]               = useState<FilterState>({
    ...FILTER_DEFAULTS,
    collection: fixedCollection || "All",
  });
  const [openKey, setOpenKey]               = useState<FilterKey | null>(null);
  const barRef                              = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const getFilterLabel = useCallback((key: FilterKey) => {
    const isTr = i18n.language === "tr";
    const isAr = i18n.language === "ar";
    if (key === "collection") return isTr ? "Koleksiyon" : isAr ? "المجموعة" : "Collection";
    if (key === "model") return isTr ? "Model" : isAr ? "الموديل" : "Model";
    if (key === "concept") return isTr ? "Konsept" : isAr ? "المفهوم" : "Concept";
    if (key === "range") return isTr ? "Cinsiyet" : isAr ? "الجنس" : "Gender";
    if (key === "type") return isTr ? "Tür" : isAr ? "النوع" : "Type";
    if (key === "material") return isTr ? "Materyal" : isAr ? "المادة" : "Material";
    if (key === "color") return isTr ? "Renk" : isAr ? "اللون" : "Color";
    return key;
  }, [i18n.language]);

  const formatOption = useCallback((k: FilterKey, opt: string) => {
    const isTr = i18n.language === "tr";
    const isAr = i18n.language === "ar";
    
    if (opt.toLowerCase() === "all") {
      return isTr ? "Tümü" : isAr ? "الكل" : "All";
    }
    
    if (k === "range") {
      const o = opt.toLowerCase().trim();
      if (o === "erkek" || o === "men" || o === "man") return isTr ? "Erkek" : isAr ? "رجال" : "Men";
      if (o === "kadın" || o === "women" || o === "woman") return isTr ? "Kadın" : isAr ? "نساء" : "Women";
      if (o === "unisex") return isTr ? "Unisex" : isAr ? "للجنسين" : "Unisex";
    }

    if (k === "concept") {
      const o = opt.toLowerCase().trim();
      if (o === "lifestyle") return isTr ? "Yaşam Tarzı" : isAr ? "أسلوب حياة" : "Lifestyle";
      if (o === "sports") return isTr ? "Spor" : isAr ? "رياضي" : "Sports";
      if (o === "aviation") return isTr ? "Havacılık" : isAr ? "طيران" : "Aviation";
    }

    if (k === "type") {
      const o = opt.toLowerCase().trim();
      if (o === "automatic") return isTr ? "Otomatik" : isAr ? "أوتوماتيكي" : "Automatic";
      if (o === "manual winding") return isTr ? "Kurmalı" : isAr ? "تعبئة يدوية" : "Manual Winding";
      if (o === "chronograph") return isTr ? "Kronograf" : isAr ? "كرونوغراف" : "Chronograph";
    }

    if (k === "material") {
      const o = opt.toLowerCase().trim();
      if (o === "titanium") return isTr ? "Titanyum" : isAr ? "تيتانيوم" : "Titanium";
      if (o === "rose gold") return isTr ? "Pembe Altın" : isAr ? "ذهب وردي" : "Rose Gold";
      if (o === "sapphire") return isTr ? "Safir" : isAr ? "ياقوت" : "Sapphire";
      if (o === "carbon") return isTr ? "Karbon" : isAr ? "كربون" : "Carbon";
      if (o === "ceramic") return isTr ? "Seramik" : isAr ? "سيراميك" : "Ceramic";
      if (o === "white gold") return isTr ? "Beyaz Altın" : isAr ? "ذهب أبيض" : "White Gold";
      if (o === "yellow gold") return isTr ? "Sarı Altın" : isAr ? "ذهب أصفر" : "Yellow Gold";
      if (o === "steel") return isTr ? "Çelik" : isAr ? "فولاذ" : "Steel";
    }

    if (k === "color") {
      const o = opt.toLowerCase().trim();
      if (o === "green") return isTr ? "Yeşil" : isAr ? "أخضر" : "Green";
      if (o === "blue") return isTr ? "Mavi" : isAr ? "أزرق" : "Blue";
      if (o === "black") return isTr ? "Siyah" : isAr ? "أسود" : "Black";
      if (o === "silver") return isTr ? "Gümüş" : isAr ? "فضي" : "Silver";
      if (o === "gold") return isTr ? "Altın" : isAr ? "ذهبي" : "Gold";
      if (o === "grey" || o === "gray") return isTr ? "Gri" : isAr ? "رمادي" : "Grey";
      if (o === "orange") return isTr ? "Turuncu" : isAr ? "برتقالي" : "Orange";
      if (o === "red") return isTr ? "Kırmızı" : isAr ? "أحمر" : "Red";
      if (o === "white") return isTr ? "Beyaz" : isAr ? "أبيض" : "White";
      if (o === "skeleton") return isTr ? "İskelet" : isAr ? "هيكل عظمي" : "Skeleton";
    }

    return opt;
  }, [i18n.language]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenKey(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenKey(null); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // Collection options = strictly limited to allowed categories
  const collectionOptions = useMemo(() => {
    return FALLBACK_OPTIONS.collection;
  }, []);

  const getOptions = (k: FilterKey) => k === "collection" ? collectionOptions : FALLBACK_OPTIONS[k];
  const setFilter  = useCallback((k: FilterKey, v: string) => setFilters(p => ({ ...p, [k]: v })), []);
  const reset      = useCallback(() => { 
    setFilters({ ...FILTER_DEFAULTS, collection: fixedCollection || "All" }); 
    setOpenKey(null); 
  }, [fixedCollection]);

  const activeCount = Object.values(filters).filter(v => v !== "All" && v !== fixedCollection).length;

  // Fetch Supabase
  useEffect(() => {
    async function load(initial = false) {
      if (initial) setIsLoading(true);
      try {
        const { data } = await supabase.from("products").select("*").eq("status", "yayinda");
        if (data) {
          const db = data.map(item => ({
            id: item.slug || item.id,
            name: item.name,
            collection: String(item.collection ?? item.category ?? "").trim(),
            tagline: item.description || (item.translations && item.translations.en && item.translations.en.description) || (item.translations && item.translations.tr && item.translations.tr.description) || item.tagline || "",
            image: item.image,
            is_from_db: true,
            model: item.translations?.metadata?.model || "",
            concept: item.translations?.metadata?.concept || "",
            range: item.translations?.metadata?.range || "",
            type: item.translations?.metadata?.type || "",
            material: item.translations?.metadata?.material || "",
            color: item.translations?.metadata?.color || "",
          }));
          const nid = (s: any) => String(s||"").toLowerCase().trim().replace(/[\u2014\s_-]/g,"");
          const ids = new Set(db.map(w => nid(w.id)));
          setAllWatches([...db, ...localWatches.filter(w => !ids.has(nid(w.id)))]);
        }
      } catch(e) { console.error(e); }
      finally { if (initial) setIsLoading(false); }
    }
    load(true);
    const ch = supabase.channel("cg").on("postgres_changes",{event:"*",schema:"public",table:"products"},()=>load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Filter
  const filtered = useMemo(() => allWatches.filter(w => {
    if (filters.collection !== "All" && String(w.collection||"").toLowerCase().trim() !== filters.collection.toLowerCase().trim()) return false;
    if (filters.model !== "All") {
      const selModel = filters.model.toLowerCase().trim();
      const wName = String(w.name || "").toLowerCase().trim();
      const wCol = String(w.collection || "").toLowerCase().trim();
      const wModel = String(w.model || "").toLowerCase().trim();
      if (wModel !== selModel && !wName.includes(selModel) && !wCol.includes(selModel)) return false;
    }
    const hay = [w.name, w.collection, w.id, w.tagline].join(" ").toLowerCase();
    
    const conceptMatch  = filters.concept  === "All" || String(w.concept || "").toLowerCase().trim() === filters.concept.toLowerCase().trim() || hay.includes(filters.concept.toLowerCase());
    
    let rangeMatch = false;
    if (filters.range === "All") {
      rangeMatch = true;
    } else {
      const val = filters.range.toLowerCase().trim();
      const wVal = String(w.range || "").toLowerCase().trim();
      
      const isErkek = val === "erkek" || val === "men" || val === "man";
      const isKadin = val === "kadın" || val === "women" || val === "woman";
      
      const wIsErkek = wVal === "erkek" || wVal === "men" || wVal === "man";
      const wIsKadin = wVal === "kadın" || wVal === "women" || wVal === "woman";
      
      if (isErkek && wIsErkek) rangeMatch = true;
      else if (isKadin && wIsKadin) rangeMatch = true;
      else if (val === "unisex" && wVal === "unisex") rangeMatch = true;
      else rangeMatch = hay.includes(val);
    }

    const typeMatch     = filters.type     === "All" || String(w.type || "").toLowerCase().trim() === filters.type.toLowerCase().trim() || hay.includes(filters.type.toLowerCase());
    const materialMatch = filters.material === "All" || String(w.material || "").toLowerCase().trim() === filters.material.toLowerCase().trim() || hay.includes(filters.material.toLowerCase());
    const colorMatch    = filters.color    === "All" || String(w.color || "").toLowerCase().trim() === filters.color.toLowerCase().trim() || hay.includes(filters.color.toLowerCase());

    return conceptMatch && rangeMatch && typeMatch && materialMatch && colorMatch;
  }), [allWatches, filters]);

  const ref = useReveal([filtered]);
  const isTr = i18n.language === "tr";
  const isAr = i18n.language === "ar";

  return (
    <section id="collections" ref={ref} style={{ position:"relative", minHeight:"100vh", background:"#000", paddingTop:72 }}>
      {/* Ghost watermark */}
      <div aria-hidden style={{ position:"absolute", top: -30, right: -30, width: "520px", height: "520px", overflow:"hidden", zIndex:0, pointerEvents:"none" }}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img 
            src="/brand-watermark.jpg" 
            alt="watermark" 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              opacity: 0.22, 
              filter: "brightness(0.38) contrast(1.25) saturate(0.65)",
              maskImage: "radial-gradient(circle, black 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 75%)"
            }} 
          />
        </div>
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:1600, margin:"0 auto", padding:"40px 16px 80px" }} className="sm:px-8 lg:px-16">

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:10, letterSpacing:"0.5em", textTransform:"uppercase", color:"rgba(255,255,255,.28)", marginBottom:12 }}>{t("nav.collections")}</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h1 style={{ fontWeight:700, fontSize:"clamp(1.8rem,5vw,3.5rem)", color:"rgba(255,255,255,.95)", lineHeight:1.05 }}>{t("collectionGrid.title")}</h1>
            {!isLoading && <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(255,255,255,.18)" }}>{filtered.length} pieces</p>}
          </div>
          <div style={{ width:64, height:1, marginTop:20, background:"linear-gradient(90deg,hsl(43,74%,49%),transparent)" }} />
        </div>

        {/* ── Filter bar — always visible ───────────────────────────────────── */}
        <div ref={barRef} style={{ marginBottom:32, position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:"clamp(16px,4vw,36px)", paddingBottom:8 }}>

            {(fixedCollection ? FILTER_KEYS.filter(k => k !== "collection") : FILTER_KEYS).map(key => {
              const isOpen   = openKey === key;
              const isActive = filters[key] !== "All";
              const opts     = getOptions(key);

              return (
                <div key={key} style={{ position:"relative", flexShrink:0 }}>
                  {/* Trigger button */}
                  <button
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    style={{ display:"flex", alignItems:"center", gap:5, background:"none", border:"none", padding:"6px 0", cursor:"pointer", outline:"none", whiteSpace:"nowrap" }}
                  >
                    <span style={{ fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase", color: isActive ? "hsl(43,74%,60%)" : "rgba(255,255,255,.5)" }}>
                      {getFilterLabel(key)}
                    </span>
                    <ChevronDown size={9} strokeWidth={1.5} style={{ color: isActive ? "hsl(43,74%,60%)" : "rgba(255,255,255,.3)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .2s" }} />
                    <span style={{ fontSize:10, letterSpacing:"0.12em", color: isActive ? "hsl(43,74%,55%)" : "rgba(255,255,255,.22)" }}>
                      {formatOption(key, filters[key])}
                    </span>
                  </button>

                  {/* Dropdown panel */}
                  {isOpen && (
                    <div style={{ position:"absolute", top:"100%", left:0, marginTop:8, background:"#0a0a0a", border:"1px solid rgba(255,255,255,.12)", borderRadius:4, minWidth:180, maxHeight:280, overflowY:"auto", zIndex:9999, boxShadow:"0 24px 60px rgba(0,0,0,.98)" }}>
                      {opts.map(opt => {
                        const sel = opt === filters[key];
                        return (
                          <button
                            key={opt}
                            onClick={() => { setFilter(key, opt); setOpenKey(null); }}
                            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 16px", background: sel ? "rgba(255,255,255,.05)" : "none", border:"none", borderBottom:"1px solid rgba(255,255,255,.04)", cursor:"pointer", outline:"none", color: sel ? "hsl(43,74%,60%)" : "rgba(255,255,255,.6)", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", textAlign:"left" }}
                            onMouseEnter={e => { if(!sel){ (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.04)"; (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.95)"; }}}
                            onMouseLeave={e => { if(!sel){ (e.currentTarget as HTMLElement).style.background="none"; (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.6)"; }}}
                          >
                            <span>{formatOption(key, opt)}</span>
                            {sel && <span style={{ width:6, height:6, borderRadius:"50%", background:"hsl(43,74%,60%)", flexShrink:0 }} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Reset all */}
            {activeCount > 0 && (
              <button onClick={reset} style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0, background:"none", border:"none", padding:"6px 0", cursor:"pointer", outline:"none", color:"rgba(255,255,255,.3)", fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", whiteSpace:"nowrap", marginLeft:8 }}>
                <X size={10} strokeWidth={2} /> {isTr ? "TÜMÜNÜ SIFIRLA" : isAr ? "إعادة ضبط الكل" : "Reset all"}
              </button>
            )}
          </div>
          <div style={{ height:1, marginTop:12, background:"rgba(255,255,255,.05)" }} />
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"128px 0", gap:16 }}>
            <div className="animate-spin" style={{ width:32, height:32, borderRadius:"50%", border:"1px solid rgba(255,255,255,.1)", borderTopColor:"hsl(43,74%,49%)" }} />
            <p style={{ fontSize:10, letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(255,255,255,.2)" }} className="animate-pulse">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"128px 0", gap:20 }}>
            <p style={{ fontSize:10, letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(255,255,255,.2)" }}>
              {isTr ? "Sonuç bulunamadı" : isAr ? "لا توجد نتائج" : "No results"}
            </p>
            <button onClick={reset} style={{ background:"none", border:"1px solid rgba(255,255,255,.12)", borderRadius:999, padding:"7px 20px", cursor:"pointer", outline:"none", color:"rgba(255,255,255,.4)", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase" }}>
              {isTr ? "Filtreleri Sıfırla" : isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8 lg:gap-y-16">
            {filtered.map((w: any) => <WatchCard key={w.id} watch={w} />)}
          </div>
        )}
      </div>
    </section>
  );
}
