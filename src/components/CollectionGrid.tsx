import { Link } from "react-router-dom";
import WatchQuickView from "./WatchQuickView";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { watches as localWatches } from "@/data/watches";
import { supabase } from "@/lib/supabase";
import { useReveal } from "@/hooks/useReveal";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useTranslation } from "react-i18next";
import { ChevronDown, Eye, X } from "lucide-react";

type FilterKey =
  | "collection"
  | "model"
  | "concept"
  | "range"
  | "type"
  | "material"
  | "color";
type FilterState = Record<FilterKey, string>;

const FILTER_DEFAULTS: FilterState = {
  collection: "All",
  model: "All",
  concept: "All",
  range: "All",
  type: "All",
  material: "All",
  color: "All",
};

const FILTER_KEYS: FilterKey[] = [
  "collection",
  "model",
  "concept",
  "range",
  "type",
  "material",
  "color",
];

const CATEGORY_NAMES = new Set([
  "all",
  "collections",
  "rare bags",
  "jewellery",
  "personalization",
  "old money",
]);

const KNOWN_LUXURY_BRANDS = [
  "Patek Philippe",
  "Richard Mille",
  "Audemars Piguet",
  "Vacheron Constantin",
  "Jaeger-LeCoultre",
  "Jaeger LeCoultre",
  "A. Lange & Söhne",
  "Van Cleef & Arpels",
  "Louis Vuitton",
  "Bottega Veneta",
  "Tag Heuer",
  "Franck Muller",
  "Jacob & Co",
  "Girard-Perregaux",
  "Roger Dubuis",
  "Ulysse Nardin",
  "Rolex",
  "Hermès",
  "Hermes",
  "Cartier",
  "Omega",
  "Chanel",
  "Dior",
  "Goyard",
  "Gucci",
  "Prada",
  "Fendi",
  "Celine",
  "Loro Piana",
  "Hublot",
  "Bvlgari",
  "Bulgari",
  "Chopard",
  "Breguet",
  "IWC",
  "Panerai",
  "Tudor",
  "Zenith",
  "Breitling",
  "Blancpain",
  "Piaget",
  "Tiffany & Co",
];

function extractMainBrand(w: any): string {
  const col = String(w?.collection || "").trim();
  if (col && !CATEGORY_NAMES.has(col.toLowerCase())) {
    if (col.toLowerCase() === "hermes") return "Hermès";
    return col;
  }
  const name = String(w?.name || "").trim();
  const nameLower = name.toLowerCase();
  if (nameLower.includes("blvgari")) return "Bulgari";
  for (const brand of KNOWN_LUXURY_BRANDS) {
    if (nameLower.includes(brand.toLowerCase())) {
      if (brand.toLowerCase() === "hermes") return "Hermès";
      if (brand.toLowerCase() === "bvlgari") return "Bulgari";
      return brand;
    }
  }
  if (w?.model) return String(w.model).trim();
  const firstWord = name.split(/\s+/)[0];
  return firstWord || col || "KBChrono";
}

// Instant in-memory caches (persist across all route navigations with zero delay)
let memoryProductsCache: any[] | null = null;
const processedImageCache = new Map<string, string>();

// ── Instant Image Display + On-Demand White Background Stripper ───────────────
function TransparentImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  // Show the image IMMEDIATELY ("çat diye") with zero spinner blocking!
  const [imageSrc, setImageSrc] = useState<string>(() => {
    if (!src) return "";
    return processedImageCache.get(src) || src;
  });

  useEffect(() => {
    if (!src) return;
    if (processedImageCache.has(src)) {
      setImageSrc(processedImageCache.get(src)!);
      return;
    }
    if (
      typeof navigator !== "undefined" &&
      navigator.userAgent?.includes("jsdom")
    ) {
      setImageSrc(src);
      return;
    }

    // Ensure immediate display while checking
    setImageSrc(src);
    let cancelled = false;

    const img = new Image();
    if (!src.startsWith("data:") && !src.startsWith("blob:")) {
      img.crossOrigin = "Anonymous";
    }

    img.onload = () => {
      if (cancelled) return;
      try {
        const natW = img.naturalWidth || img.width;
        const natH = img.naturalHeight || img.height;
        if (!natW || !natH) return;

        // 1. Ultra-fast 48x48 probe (0.05ms) to check if the image is ALREADY transparent
        const probeSize = 48;
        const probeCanvas = document.createElement("canvas");
        probeCanvas.width = probeSize;
        probeCanvas.height = probeSize;
        const pCtx = probeCanvas.getContext("2d", { willReadFrequently: true });
        if (!pCtx) return;

        pCtx.drawImage(img, 0, 0, probeSize, probeSize);
        const pData = pCtx.getImageData(0, 0, probeSize, probeSize).data;

        let pMinX = probeSize,
          pMinY = probeSize,
          pMaxX = 0,
          pMaxY = 0;
        for (let y = 0; y < probeSize; y++) {
          for (let x = 0; x < probeSize; x++) {
            if (pData[(y * probeSize + x) * 4 + 3] > 25) {
              if (x < pMinX) pMinX = x;
              if (x > pMaxX) pMaxX = x;
              if (y < pMinY) pMinY = y;
              if (y > pMaxY) pMaxY = y;
            }
          }
        }

        if (pMinX >= pMaxX || pMinY >= pMaxY) {
          processedImageCache.set(src, src);
          return;
        }

        const pInsetX = Math.min(2, Math.floor((pMaxX - pMinX) * 0.05));
        const pInsetY = Math.min(2, Math.floor((pMaxY - pMinY) * 0.05));
        const pMidX = Math.floor((pMinX + pMaxX) / 2);
        const pMidY = Math.floor((pMinY + pMaxY) / 2);

        const probeSamples = [
          [pMinX + pInsetX, pMinY + pInsetY],
          [pMaxX - pInsetX, pMinY + pInsetY],
          [pMinX + pInsetX, pMaxY - pInsetY],
          [pMaxX - pInsetX, pMaxY - pInsetY],
          [pMinX + pInsetX, pMidY],
          [pMaxX - pInsetX, pMidY],
          [pMidX, pMinY + pInsetY],
          [pMidX, pMaxY - pInsetY],
        ];

        let whiteBoxCorners = 0;
        for (const [sx, sy] of probeSamples) {
          const idx = (sy * probeSize + sx) * 4;
          const r = pData[idx];
          const g = pData[idx + 1];
          const b = pData[idx + 2];
          const a = pData[idx + 3];
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          if (a > 150 && r > 205 && g > 205 && b > 205 && maxC - minC < 30) {
            whiteBoxCorners++;
          }
        }

        // FAST PATH (98% of images): Already transparent! Keep original src with 0ms overhead!
        if (whiteBoxCorners < 2) {
          processedImageCache.set(src, src);
          return;
        }

        // 2. ONLY for images that actually have a white background: strip background on a fast 520px canvas
        const maxDim = 520;
        const scale = Math.min(1, maxDim / Math.max(natW, natH));
        const w = Math.max(1, Math.round(natW * scale));
        const h = Math.max(1, Math.round(natH * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let initMinX = w,
          initMinY = h,
          initMaxX = 0,
          initMaxY = 0;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (data[(y * w + x) * 4 + 3] > 25) {
              if (x < initMinX) initMinX = x;
              if (x > initMaxX) initMaxX = x;
              if (y < initMinY) initMinY = y;
              if (y > initMaxY) initMaxY = y;
            }
          }
        }

        const totalPixels = w * h;
        const visited = new Uint8Array(totalPixels);
        const queue = new Int32Array(totalPixels);
        let head = 0;
        let tail = 0;

        const isBgCandidate = (pIdx: number) => {
          const i = pIdx * 4;
          const a = data[i + 3];
          if (a <= 25) return true;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          return r > 212 && g > 212 && b > 212 && maxC - minC < 28;
        };

        const enqueue = (pIdx: number) => {
          if (visited[pIdx] === 0 && isBgCandidate(pIdx)) {
            visited[pIdx] = 1;
            queue[tail++] = pIdx;
          }
        };

        for (let x = 0; x < w; x++) {
          enqueue(x);
          enqueue((h - 1) * w + x);
        }
        for (let y = 1; y < h - 1; y++) {
          enqueue(y * w);
          enqueue(y * w + (w - 1));
        }
        if (initMinX < initMaxX && initMinY < initMaxY) {
          for (let x = initMinX; x <= initMaxX; x++) {
            enqueue(initMinY * w + x);
            enqueue(initMaxY * w + x);
          }
          for (let y = initMinY; y <= initMaxY; y++) {
            enqueue(y * w + initMinX);
            enqueue(y * w + initMaxX);
          }
        }

        while (head < tail) {
          const curr = queue[head++];
          data[curr * 4 + 3] = 0;
          const cx = curr % w;
          const cy = (curr - cx) / w;
          if (cx > 0) enqueue(curr - 1);
          if (cx < w - 1) enqueue(curr + 1);
          if (cy > 0) enqueue(curr - w);
          if (cy < h - 1) enqueue(curr + w);
        }

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (
            r > 236 &&
            g > 236 &&
            b > 236 &&
            Math.max(r, g, b) - Math.min(r, g, b) < 20
          ) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const pngDataUrl = canvas.toDataURL("image/png");
        processedImageCache.set(src, pngDataUrl);
        if (!cancelled) setImageSrc(pngDataUrl);
      } catch {
        processedImageCache.set(src, src);
      }
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!imageSrc) return null;

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      className={className}
    />
  );
}

// ── Award-Winning Luxury Motion Div Card (2px Elevated Frame + Editorial Typography) ──
function LuxuryDivCard({
  watch,
  onQuickView,
}: {
  watch: any;
  onQuickView: (w: any) => void;
}) {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language === "tr";
  const isAr = i18n.language === "ar";
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 180, y: 180 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { translated } = useAutoTranslate({
    name: watch.name || "",
    collection: watch.collection || "",
    tagline: watch.tagline || "",
  });

  const rawName = t(`watches.${watch.id}.name`, { defaultValue: watch.name });
  const rawCol = t(`watches.${watch.id}.collection`, {
    defaultValue: watch.collection,
  });
  const rawTag = t(`watches.${watch.id}.tagline`, {
    defaultValue: watch.tagline,
  });

  const name =
    i18n.language === "tr"
      ? watch.name
      : watch.is_from_db
      ? translated.name || watch.name
      : rawName === `watches.${watch.id}.name`
      ? watch.name
      : rawName;
  const col =
    i18n.language === "tr"
      ? watch.collection
      : watch.is_from_db
      ? translated.collection || watch.collection
      : rawCol === `watches.${watch.id}.collection`
      ? watch.collection
      : rawCol;
  const tag =
    i18n.language === "tr"
      ? watch.tagline
      : watch.is_from_db
      ? translated.tagline || watch.tagline
      : rawTag === `watches.${watch.id}.tagline`
      ? watch.tagline
      : rawTag;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });

    // Smooth 3D luxury micro-tilt
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    setTilt({
      rx: Number((-normY * 5).toFixed(2)),
      ry: Number((normX * 5).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between overflow-hidden"
      style={{
        background:
          "linear-gradient(165deg, #111116 0%, #0A0A0E 48%, #060609 100%)",
        border: isHovered
          ? "2px solid rgba(212, 175, 55, 0.58)"
          : "2px solid rgba(212, 175, 55, 0.26)",
        borderRadius: "16px",
        transform: isHovered
          ? `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-6px) scale(1.012)`
          : "perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
        transition: isHovered
          ? "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), border-color 400ms ease, box-shadow 400ms ease"
          : "transform 550ms cubic-bezier(0.22, 1, 0.36, 1), border-color 400ms ease, box-shadow 400ms ease",
        boxShadow: isHovered
          ? "0 28px 60px -12px rgba(0, 0, 0, 0.98), 0 10px 30px -6px rgba(212, 175, 55, 0.22), inset 0 1px 0 0 rgba(255, 243, 176, 0.22)"
          : "0 16px 38px -8px rgba(0, 0, 0, 0.94), 0 4px 16px -2px rgba(212, 175, 55, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        willChange: "transform",
      }}
    >
      {/* Top Specular Champagne Rim Shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-[1px] z-20 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0.45,
          background:
            "linear-gradient(90deg, transparent, rgba(243, 229, 171, 0.75), transparent)",
        }}
      />

      {/* Interactive Cursor Radial Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(360px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(212, 175, 55, 0.16), transparent 70%)`,
        }}
      />

      {/* Diagonal Glass Specular Sheen Sweep on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-transform duration-1000 ease-out -translate-x-full group-hover:translate-x-full"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255, 243, 176, 0.06) 47%, rgba(212, 175, 55, 0.12) 50%, transparent 68%)",
        }}
      />

      {/* Transparent PNG Front Showcase Stage with Breathing Studio Halo */}
      <div className="relative w-full aspect-square flex items-center justify-center p-7 bg-transparent overflow-hidden z-10">
        {/* Soft Studio Halo Behind Watch */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-4/5 h-4/5 rounded-full transition-all duration-700 ease-out group-hover:scale-110"
          style={{
            background: isHovered
              ? "radial-gradient(circle, rgba(212, 175, 55, 0.13) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 72%)"
              : "radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, rgba(255, 255, 255, 0.015) 45%, transparent 70%)",
          }}
        />

        {/* Floating Pedestal Floor Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-4 rounded-full transition-all duration-700 group-hover:w-2/5 group-hover:opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.92) 0%, transparent 75%)",
            filter: "blur(4px)",
          }}
        />

        <Link
          to={`/watch/${watch.id}`}
          className="relative w-full h-full flex items-center justify-center"
          style={{ textDecoration: "none" }}
        >
          <TransparentImage
            src={watch.image}
            alt={name}
            className="w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.085] group-hover:-translate-y-2 drop-shadow-[0_18px_32px_rgba(0,0,0,0.9)]"
          />
        </Link>

        {/* Bottom Quick-View Glass Capsule Revealed Smoothly on Hover */}
        <div className="absolute inset-x-5 bottom-3.5 z-20 flex justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(watch);
            }}
            className="w-full py-2.5 px-4 rounded-full text-[9.5px] tracking-[0.26em] uppercase font-semibold text-white/95 hover:text-black hover:bg-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-xl cursor-pointer group/qv"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: "rgba(10, 10, 15, 0.86)",
              border: "1px solid rgba(212, 175, 55, 0.42)",
              boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.9)",
            }}
          >
            <Eye
              size={13}
              className="text-[#D4AF37] group-hover/qv:text-black transition-colors"
            />
            <span>
              {t("common.quickView", { defaultValue: "QUICK VIEW" })}
            </span>
          </button>
        </div>
      </div>

      {/* Editorial Haute Horlogerie Footer Plaque */}
      <Link
        to={`/watch/${watch.id}`}
        className="relative z-10 px-5 pb-5 pt-4 block transition-colors duration-500"
        style={{
          textDecoration: "none",
          background:
            "linear-gradient(180deg, rgba(16, 16, 22, 0.55) 0%, rgba(7, 7, 10, 0.92) 100%)",
          borderTop: "1px solid rgba(212, 175, 55, 0.14)",
        }}
      >
        {/* Top Row: Cinzel Maison Name + Glass Reference Pill */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              aria-hidden="true"
              className="text-[7px] text-[#D4AF37] opacity-80 group-hover:rotate-45 transition-transform duration-500"
            >
              ◆
            </span>
            <p
              className="text-[10px] tracking-[0.26em] uppercase font-semibold truncate"
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', serif",
                background:
                  "linear-gradient(90deg, #F5E1A4 0%, #D4AF37 55%, #C59B27 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {col}
            </p>
          </div>

          {watch.sku && (
            <span
              className="px-2.5 py-0.5 rounded-full text-[8.5px] tracking-[0.16em] uppercase text-white/45 flex-shrink-0"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: "rgba(255, 255, 255, 0.035)",
                border: "1px solid rgba(212, 175, 55, 0.16)",
              }}
            >
              {watch.sku}
            </span>
          )}
        </div>

        {/* Timepiece Title */}
        <h3
          className="text-[15px] sm:text-[15.5px] font-medium text-[#F8F8FA] group-hover:text-[#F3E5AB] transition-colors duration-300 truncate mb-1.5"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "0.015em",
          }}
        >
          {name}
        </h3>

        {/* Editorial Curated Note */}
        {tag && (
          <p
            className="text-[11.5px] font-light text-white/45 truncate mb-3.5 pl-2.5"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "0.02em",
              borderLeft: "1.5px solid rgba(212, 175, 55, 0.35)",
            }}
          >
            {tag}
          </p>
        )}

        {/* Collector Value & Interactive Dossier Capsule */}
        <div
          className="flex items-center justify-between pt-3"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-[7.5px] tracking-[0.28em] uppercase text-white/35 mb-0.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {isTr ? "KOLEKSİYON DEĞERİ" : isAr ? "القيمة" : "COLLECTOR PRICE"}
            </span>
            <span
              className="text-sm sm:text-[15px] font-semibold text-white tracking-[0.06em] tabular-nums"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {watch.price || "Price on Request"}
            </span>
          </div>

          <span
            className="px-3.5 py-1.5 rounded-full text-[8.5px] tracking-[0.22em] uppercase font-semibold transition-all duration-500 flex items-center gap-1.5 text-[#D4AF37] group-hover:text-black group-hover:bg-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.45)]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              background: isHovered
                ? "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 55%, #B8860B 100%)"
                : "rgba(212, 175, 55, 0.06)",
            }}
          >
            <span>{isTr ? "İNCELE" : isAr ? "عرض" : "VIEW DOSSIER"}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}

// ── Main Grid Component Across All 5 Menu Pages ──────────────────────────────
export default function CollectionGrid({
  fixedCollection,
}: { fixedCollection?: string } = {}) {
  const [allWatches, setAllWatches] = useState<any[]>(
    () => memoryProductsCache || localWatches
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    ...FILTER_DEFAULTS,
    collection: fixedCollection || "All",
  });
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [quickViewWatch, setQuickViewWatch] = useState<any>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  // Reset sub-filters when switching menu route
  useEffect(() => {
    setFilters({
      ...FILTER_DEFAULTS,
      collection: fixedCollection || "All",
    });
    setSelectedBrand("All");
  }, [fixedCollection]);

  const getFilterLabel = useCallback(
    (key: FilterKey) => {
      const isTr = i18n.language === "tr";
      const isAr = i18n.language === "ar";
      if (key === "collection")
        return isTr ? "Koleksiyon" : isAr ? "المجموعة" : "Collection";
      if (key === "model")
        return isTr ? "Model" : isAr ? "الموديل" : "Model";
      if (key === "concept")
        return isTr ? "Konsept" : isAr ? "المفهوم" : "Concept";
      if (key === "range")
        return isTr ? "Cinsiyet" : isAr ? "الجنس" : "Gender";
      if (key === "type") return isTr ? "Tür" : isAr ? "النوع" : "Type";
      if (key === "material")
        return isTr ? "Materyal" : isAr ? "المادة" : "Material";
      if (key === "color") return isTr ? "Renk" : isAr ? "اللون" : "Color";
      return key;
    },
    [i18n.language]
  );

  const formatOption = useCallback(
    (k: FilterKey, opt: string) => {
      const isTr = i18n.language === "tr";
      const isAr = i18n.language === "ar";
      if (opt.toLowerCase() === "all") {
        return isTr ? "Tümü" : isAr ? "الكل" : "All";
      }
      if (k === "range") {
        const o = opt.toLowerCase().trim();
        if (o === "erkek" || o === "men" || o === "man")
          return isTr ? "Erkek" : isAr ? "رجال" : "Men";
        if (o === "kadın" || o === "women" || o === "woman")
          return isTr ? "Kadın" : isAr ? "نساء" : "Women";
        if (o === "unisex")
          return isTr ? "Unisex" : isAr ? "للجنسين" : "Unisex";
      }
      return opt;
    },
    [i18n.language]
  );

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
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const setFilter = useCallback(
    (k: FilterKey, v: string) => setFilters((p) => ({ ...p, [k]: v })),
    []
  );

  const reset = useCallback(() => {
    setFilters({ ...FILTER_DEFAULTS, collection: fixedCollection || "All" });
    setSelectedBrand("All");
    setOpenKey(null);
  }, [fixedCollection]);

  const activeCount =
    Object.values(filters).filter(
      (v) => v !== "All" && v !== fixedCollection
    ).length + (selectedBrand !== "All" ? 1 : 0);

  // Fetch Supabase once and keep in memoryProductsCache for instant 0ms route switches
  useEffect(() => {
    if (memoryProductsCache && memoryProductsCache.length > 0) {
      setAllWatches(memoryProductsCache);
      return;
    }

    let isMounted = true;
    async function load() {
      try {
        // Lightweight column select (excludes heavy multi-image array to download 5x faster)
        const { data, error } = await supabase
          .from("products")
          .select(
            "id,slug,name,sku,price,collection,description,tagline,image,translations,status"
          )
          .eq("status", "yayinda");

        if (!error && data && data.length > 0 && isMounted) {
          const db = data.map((item: any) => ({
            id: item.slug || item.id,
            name: item.name,
            sku: item.sku,
            price: item.price,
            collection: String(item.collection ?? item.category ?? "").trim(),
            tagline:
              item.description ||
              item.translations?.en?.description ||
              item.translations?.tr?.description ||
              item.tagline ||
              "",
            image: item.image,
            is_from_db: true,
            model: item.translations?.metadata?.model || "",
            concept: item.translations?.metadata?.concept || "",
            range: item.translations?.metadata?.range || "",
            type: item.translations?.metadata?.type || "",
            material: item.translations?.metadata?.material || "",
            color: item.translations?.metadata?.color || "",
          }));
          memoryProductsCache = db;
          setAllWatches(db);
        }
      } catch {
        // Keep localWatches fallback seamlessly
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Base products for the current page category
  const baseProducts = useMemo(() => {
    return allWatches.filter((w) => {
      if (fixedCollection) {
        return (
          String(w.collection || "")
            .toLowerCase()
            .trim() === fixedCollection.toLowerCase().trim()
        );
      } else {
        const colLower = String(w.collection || "")
          .toLowerCase()
          .trim();
        return (
          colLower !== "rare bags" &&
          colLower !== "jewellery" &&
          colLower !== "personalization" &&
          colLower !== "old money"
        );
      }
    });
  }, [allWatches, fixedCollection]);

  // 2. Extract unique main brands from all uploaded products for Instagram Highlights bar
  const brandHighlights = useMemo(() => {
    const brands: string[] = [];
    baseProducts.forEach((w) => {
      const brand = extractMainBrand(w);
      if (
        brand &&
        !brands.some((b) => b.toLowerCase() === brand.toLowerCase())
      ) {
        brands.push(brand);
      }
    });
    return brands;
  }, [baseProducts]);

  // 3. Filter the base products according to user selected filters & brand highlight
  const filtered = useMemo(() => {
    return baseProducts.filter((w) => {
      if (selectedBrand !== "All") {
        const selB = selectedBrand.toLowerCase().trim();
        const wBrand = extractMainBrand(w).toLowerCase().trim();
        const wCol = String(w.collection || "").toLowerCase().trim();
        const wName = String(w.name || "").toLowerCase().trim();
        if (wBrand !== selB && wCol !== selB && !wName.includes(selB)) {
          return false;
        }
      }

      if (
        filters.collection !== "All" &&
        String(w.collection || "")
          .toLowerCase()
          .trim() !== filters.collection.toLowerCase().trim()
      )
        return false;

      if (filters.model !== "All") {
        const selModel = filters.model.toLowerCase().trim();
        const wName = String(w.name || "").toLowerCase().trim();
        const wCol = String(w.collection || "").toLowerCase().trim();
        const wModel = String(w.model || "").toLowerCase().trim();
        if (
          wModel !== selModel &&
          !wName.includes(selModel) &&
          !wCol.includes(selModel)
        )
          return false;
      }

      const hay = [w.name, w.collection, w.id, w.tagline]
        .join(" ")
        .toLowerCase();

      const conceptMatch =
        filters.concept === "All" ||
        String(w.concept || "")
          .toLowerCase()
          .trim() === filters.concept.toLowerCase().trim() ||
        hay.includes(filters.concept.toLowerCase());

      let rangeMatch = false;
      if (filters.range === "All") {
        rangeMatch = true;
      } else {
        const val = filters.range.toLowerCase().trim();
        const wVal = String(w.range || "").toLowerCase().trim();
        const isErkek = val === "erkek" || val === "men" || val === "man";
        const isKadin = val === "kadın" || val === "women" || val === "woman";
        const wIsErkek = wVal === "erkek" || wVal === "men" || wVal === "man";
        const wIsKadin =
          wVal === "kadın" || wVal === "women" || wVal === "woman";
        if (isErkek && wIsErkek) rangeMatch = true;
        else if (isKadin && wIsKadin) rangeMatch = true;
        else if (val === "unisex" && wVal === "unisex") rangeMatch = true;
        else rangeMatch = hay.includes(val);
      }

      const typeMatch =
        filters.type === "All" ||
        String(w.type || "")
          .toLowerCase()
          .trim() === filters.type.toLowerCase().trim() ||
        hay.includes(filters.type.toLowerCase());
      const materialMatch =
        filters.material === "All" ||
        String(w.material || "")
          .toLowerCase()
          .trim() === filters.material.toLowerCase().trim() ||
        hay.includes(filters.material.toLowerCase());
      const colorMatch =
        filters.color === "All" ||
        String(w.color || "")
          .toLowerCase()
          .trim() === filters.color.toLowerCase().trim() ||
        hay.includes(filters.color.toLowerCase());

      return (
        conceptMatch && rangeMatch && typeMatch && materialMatch && colorMatch
      );
    });
  }, [baseProducts, filters, selectedBrand]);

  // 4. Extract dynamic options present in the base products
  const dynamicOptions = useMemo(() => {
    const opts: Record<FilterKey, string[]> = {
      collection: ["All"],
      model: ["All"],
      concept: ["All"],
      range: ["All"],
      type: ["All"],
      material: ["All"],
      color: ["All"],
    };

    baseProducts.forEach((w) => {
      (
        [
          "collection",
          "model",
          "concept",
          "range",
          "type",
          "material",
          "color",
        ] as FilterKey[]
      ).forEach((key) => {
        if (w[key]) {
          const val = String(w[key]).trim();
          if (
            val &&
            !opts[key].some((o) => o.toLowerCase() === val.toLowerCase())
          ) {
            opts[key].push(val);
          }
        }
      });
    });

    return opts;
  }, [baseProducts]);

  const ref = useReveal([filtered]);
  const isTr = i18n.language === "tr";
  const isAr = i18n.language === "ar";

  return (
    <section
      id="collections"
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#000000",
        paddingTop: fixedCollection ? 24 : 72,
      }}
    >
      {/* Ghost watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: "520px",
          height: "520px",
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
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
              WebkitMaskImage:
                "radial-gradient(circle, black 30%, transparent 75%)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1600,
          margin: "0 auto",
          padding: "40px 16px 80px",
        }}
        className="sm:px-8 lg:px-16"
      >
        {/* Centered Gold Title (same style as JEWELLERY COLLECTION) */}
        {!fixedCollection && (
          <div className="pb-8 px-6">
            <h1 className="text-3xl md:text-5xl text-gradient-gold font-bold tracking-[0.2em] uppercase text-center">
              {t("nav.collections", { defaultValue: "Collections" }) ===
              "nav.collections"
                ? "Collections"
                : t("nav.collections", { defaultValue: "Collections" })}
            </h1>
          </div>
        )}

        {/* ── Instagram Highlights-Style Brand Circles Bar (Centered) ───── */}
        {brandHighlights.length > 0 && (
          <div className="mb-8 pt-1 w-full flex justify-center">
            <div
              className="flex items-center justify-center flex-wrap gap-5 sm:gap-8 pb-3 pt-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* "All" Highlight Circle */}
              {(() => {
                const isAllActive = selectedBrand === "All";
                const allLabel = isTr ? "Tümü" : isAr ? "الكل" : "All";
                return (
                  <button
                    type="button"
                    onClick={() => setSelectedBrand("All")}
                    className="group flex flex-col items-center gap-2.5 flex-shrink-0 cursor-pointer bg-transparent border-none outline-none"
                  >
                    <div
                      className="w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: isAllActive
                          ? "linear-gradient(135deg, #FFF3B0 0%, #F59E0B 35%, #D4AF37 70%, #FDE047 100%)"
                          : "linear-gradient(135deg, rgba(212,175,55,0.85) 0%, rgba(170,119,28,0.5) 50%, rgba(212,175,55,0.85) 100%)",
                        boxShadow: isAllActive
                          ? "0 0 22px rgba(212, 175, 55, 0.55), 0 6px 16px rgba(0, 0, 0, 0.85)"
                          : "0 0 12px rgba(212, 175, 55, 0.2), 0 6px 16px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-black p-[3px] flex items-center justify-center">
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center px-2 overflow-hidden"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, #030304 75%)",
                          }}
                        >
                          <span
                            className="text-[18px] sm:text-[21px] font-bold select-none -rotate-3 transition-transform duration-300 group-hover:scale-105"
                            style={{
                              fontFamily:
                                "'Dancing Script', 'Playfair Display', Georgia, cursive",
                              background:
                                "linear-gradient(95deg, #FDE047 0%, #F59E0B 55%, #EA580C 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {allLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-[10px] tracking-[0.16em] uppercase font-medium transition-colors"
                      style={{
                        color: isAllActive
                          ? "#D4AF37"
                          : "rgba(255, 255, 255, 0.65)",
                      }}
                    >
                      {allLabel}
                    </span>
                  </button>
                );
              })()}

              {/* Dynamic Main Brand Highlight Circles */}
              {brandHighlights.map((brand) => {
                const isSelected =
                  selectedBrand.toLowerCase().trim() ===
                  brand.toLowerCase().trim();
                const isLongName = brand.length > 10;

                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() =>
                      setSelectedBrand(isSelected ? "All" : brand)
                    }
                    className="group flex flex-col items-center gap-2.5 flex-shrink-0 cursor-pointer bg-transparent border-none outline-none"
                  >
                    {/* Golden Instagram Highlight Ring */}
                    <div
                      className="w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #FFF3B0 0%, #F59E0B 35%, #D4AF37 70%, #FDE047 100%)"
                          : "linear-gradient(135deg, #FDE08D 0%, #D4AF37 45%, #9A6F1A 80%, #F3E5AB 100%)",
                        boxShadow: isSelected
                          ? "0 0 24px rgba(212, 175, 55, 0.65), 0 6px 16px rgba(0, 0, 0, 0.9)"
                          : "0 0 14px rgba(212, 175, 55, 0.24), 0 6px 16px rgba(0, 0, 0, 0.85)",
                      }}
                    >
                      {/* Inner Story Black Gap + Obsidian Circle */}
                      <div className="w-full h-full rounded-full bg-black p-[3px] flex items-center justify-center">
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center px-2 text-center overflow-hidden"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.09) 0%, #030304 75%)",
                          }}
                        >
                          <span
                            className={`font-bold select-none -rotate-3 transition-transform duration-300 group-hover:scale-105 leading-[1.1] ${
                              isLongName
                                ? "text-[13px] sm:text-[15px]"
                                : "text-[17px] sm:text-[20px]"
                            }`}
                            style={{
                              fontFamily:
                                "'Dancing Script', 'Playfair Display', Georgia, cursive",
                              background:
                                "linear-gradient(95deg, #FDE047 0%, #F59E0B 52%, #EA580C 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {brand}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Highlight Title Under Circle */}
                    <span
                      className="text-[10px] tracking-[0.15em] uppercase font-medium max-w-[96px] truncate transition-colors group-hover:text-[#D4AF37]"
                      style={{
                        color: isSelected
                          ? "#D4AF37"
                          : "rgba(255, 255, 255, 0.72)",
                      }}
                    >
                      {brand}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Filter Bar (Centered) ────────────────────────── */}
        <div
          ref={barRef}
          style={{ marginBottom: 32, position: "relative", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "clamp(14px,3vw,28px)",
              paddingBottom: 10,
            }}
          >
            <div className="flex items-center justify-center flex-wrap gap-5 sm:gap-7">
              {(fixedCollection
                ? FILTER_KEYS.filter((k) => k !== "collection")
                : FILTER_KEYS
              ).map((key) => {
                const opts = dynamicOptions[key];
                if (opts.length <= 1) return null;
                const isOpen = openKey === key;
                const isActive = filters[key] !== "All";

                return (
                  <div key={key} style={{ position: "relative", flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "none",
                        border: "none",
                        padding: "6px 0",
                        cursor: "pointer",
                        outline: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.28em",
                          textTransform: "uppercase",
                          color: isActive
                            ? "#D4AF37"
                            : "rgba(255,255,255,.55)",
                        }}
                      >
                        {getFilterLabel(key)}
                      </span>
                      <ChevronDown
                        size={9}
                        strokeWidth={1.5}
                        style={{
                          color: isActive
                            ? "#D4AF37"
                            : "rgba(255,255,255,.35)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform .2s",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          color: isActive
                            ? "#D4AF37"
                            : "rgba(255,255,255,.28)",
                        }}
                      >
                        {formatOption(key, filters[key])}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          marginTop: 8,
                          background: "#0A0A0D",
                          border: "1px solid rgba(212, 175, 55, 0.24)",
                          borderRadius: 12,
                          minWidth: 190,
                          maxHeight: 280,
                          overflowY: "auto",
                          zIndex: 9999,
                          boxShadow: "0 24px 60px rgba(0,0,0,.98)",
                        }}
                      >
                        {opts.map((opt) => {
                          const sel = opt === filters[key];
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setFilter(key, opt);
                                setOpenKey(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "10px 16px",
                                background: sel
                                  ? "rgba(212, 175, 55, 0.1)"
                                  : "none",
                                border: "none",
                                borderBottom:
                                  "1px solid rgba(255,255,255,.04)",
                                cursor: "pointer",
                                outline: "none",
                                color: sel
                                  ? "#D4AF37"
                                  : "rgba(255,255,255,.65)",
                                fontSize: 10,
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                textAlign: "left",
                              }}
                            >
                              <span>{formatOption(key, opt)}</span>
                              {sel && (
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#D4AF37",
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    flexShrink: 0,
                    background: "none",
                    border: "none",
                    padding: "6px 0",
                    cursor: "pointer",
                    outline: "none",
                    color: "#D4AF37",
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  <X size={10} strokeWidth={2} />{" "}
                  {isTr
                    ? "TÜMÜNÜ SIFIRLA"
                    : isAr
                    ? "إعادة ضبط الكل"
                    : "Reset all"}
                </button>
              )}
            </div>

            {fixedCollection && !isLoading && (
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.28em] uppercase text-white/35">
                  {filtered.length} {filtered.length === 1 ? "PIECE" : "PIECES"}
                </span>
              </div>
            )}
          </div>
          <div
            style={{
              height: 1,
              marginTop: 8,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.28), transparent)",
            }}
          />
        </div>

        {/* ── Product Grid ─────────────────────────────────── */}
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "128px 0",
              gap: 16,
            }}
          >
            <div
              className="animate-spin"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,.1)",
                borderTopColor: "#D4AF37",
              }}
            />
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.2)",
              }}
              className="animate-pulse"
            >
              Loading...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "110px 20px",
              gap: 20,
              background: "#0A0A0D",
              border: "2px solid rgba(212, 175, 55, 0.22)",
              borderRadius: "16px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.45)",
              }}
            >
              {isTr
                ? "Sonuç bulunamadı"
                : isAr
                ? "لا توجد نتائج"
                : "No results"}
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                background: "none",
                border: "1px solid rgba(212, 175, 55, 0.45)",
                borderRadius: 999,
                padding: "9px 24px",
                cursor: "pointer",
                outline: "none",
                color: "#D4AF37",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              {isTr
                ? "Filtreleri Sıfırla"
                : isAr
                ? "إعادة ضبط الفلاتر"
                : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filtered.map((w: any) => (
              <LuxuryDivCard
                key={w.id}
                watch={w}
                onQuickView={setQuickViewWatch}
              />
            ))}
          </div>
        )}
      </div>

      {quickViewWatch && (
        <WatchQuickView
          watch={quickViewWatch}
          onClose={() => setQuickViewWatch(null)}
        />
      )}
    </section>
  );
}
