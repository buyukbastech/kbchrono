import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, Search, Settings2, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { watches as localWatches } from "@/data/watches";

const languages = [
  { code: "en", label: "English", flag: "ENGLISH" },
  { code: "tr", label: "Türkçe", flag: "TÜRKÇE" },
  { code: "ar", label: "العربية", flag: "العربية" },
];

export default function CollectionsHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allWatches, setAllWatches] = useState<any[]>([]);

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Load products dynamically
  useEffect(() => {
    async function load() {
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
        } else {
          setAllWatches(localWatches);
        }
      } catch(e) { 
        console.error(e);
        setAllWatches(localWatches);
      }
    }
    load();
  }, []);

  const isTr = i18n.language === "tr";
  const isAr = i18n.language === "ar";

  // Filter watches by query
  const filteredWatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allWatches.filter(w => {
      const wName = String(w.name || "").toLowerCase();
      const wCol = String(w.collection || "").toLowerCase();
      const wModel = String(w.model || "").toLowerCase();
      const wTag = String(w.tagline || "").toLowerCase();
      return wName.includes(q) || wCol.includes(q) || wModel.includes(q) || wTag.includes(q);
    });
  }, [searchQuery, allWatches]);

  // Handle ESC key press
  useEffect(() => {
    const h = (e: KeyboardEvent) => { 
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false); // Adım 1: Anında kapat
    
    // Adım 2: Yönlendir ve Scroll yap
    if (href.startsWith("/#")) {
      const targetId = href.split("#")[1];
      if (location.pathname === "/") {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 400); // Sayfa değişim animasyonu için biraz daha bekle
      }
    } else {
      navigate(href);
      if (location.pathname === href) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || searchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  const toggleLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("i18nextLng_manual", "true");
    setLangOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const navItems = [
    { label: t("nav.collections"), href: "/collections" },
    { label: "Rare Bags", href: "/rare-bags" },
    { label: "Jewellery", href: "/jewellery" },
    { label: "Personalization", href: "/personalization" },
    { label: "Old Money", href: "/old-money" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-white/5" : ""
        }`}
        style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* LEFT — Hamburger + MENU */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-3 group"
              aria-label="Open menu"
            >
              {/* Two-line hamburger */}
              <div className="flex flex-col gap-[5px]">
                <span className="block w-5 h-px bg-white/70 group-hover:bg-white transition-colors duration-200" />
                <span className="block w-5 h-px bg-white/70 group-hover:bg-white transition-colors duration-200" />
              </div>
              <span className="hidden sm:block text-[10px] tracking-[0.3em] text-white/60 group-hover:text-white transition-colors duration-200 uppercase">
                {isTr ? "Menü" : isAr ? "القائمة" : "Menu"}
              </span>
            </button>

            {/* CENTER — Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <img src="/kb-logo.png" alt="kbchrono" className="h-10 sm:h-[3.5rem] w-auto" />
              <span
                className="text-sm sm:text-base font-bold tracking-[0.35em] uppercase"
                style={{
                  background: "linear-gradient(135deg, hsl(43,74%,49%), hsl(43,74%,70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                KBCHRONO
              </span>
            </Link>

            {/* RIGHT — Search / Language / Collections */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={13} strokeWidth={1.5} />
                <span className="hidden sm:inline">{isTr ? "Arama" : isAr ? "بحث" : "Search"}</span>
              </button>

              {/* Language dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-white/50 hover:text-white uppercase transition-colors duration-200"
                >
                  <span>{currentLang.flag}</span>
                  <ChevronDown
                    size={10}
                    strokeWidth={1.5}
                    className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {langOpen && (
                  <div
                    className="absolute top-full right-0 mt-3 w-36 py-2 z-50"
                    style={{
                      background: "#0a0a0a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "4px",
                    }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => toggleLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-white ${
                          i18n.language === lang.code
                            ? "text-amber-500 font-semibold"
                            : "text-white/40"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Collections pill */}
              <Link
                to="/collections"
                className="hidden md:flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors duration-200"
              >
                <Settings2 size={12} strokeWidth={1.5} />
                <span>{isTr ? "Koleksiyonlar" : isAr ? "المجموعات" : "Collections"}</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ── Full-Screen Overlay Menu ── */}
      <div
        className={`fixed inset-0 z-[500] transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "#000000" }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-5 text-white/60 hover:text-white transition-colors p-4 z-50 cursor-pointer"
          aria-label="Close"
        >
          <X size={32} strokeWidth={1.5} />
        </button>

        <a 
          href="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="absolute top-5 left-6 flex items-center gap-2 cursor-pointer z-50 transition-opacity hover:opacity-80"
        >
          <img src="/kb-logo.png" alt="kbchrono" className="h-12 w-auto" />
          <span
            className="text-sm font-bold tracking-[0.35em] uppercase"
            style={{
              background: "linear-gradient(135deg, hsl(43,74%,49%), hsl(43,74%,70%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            KBCHRONO
          </span>
        </a>

        <div
          className={`flex flex-col justify-start sm:justify-center h-full px-10 sm:px-16 gap-8 transition-all duration-500 overflow-y-auto pt-28 pb-12 ${
            menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: menuOpen ? "0.1s" : "0s" }}
        >
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-white/80 hover:text-white transition-colors duration-300 border-b border-white/5 pb-8 block"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                fontWeight: 300,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                transitionDelay: `${0.04 * i}s`,
                cursor: "pointer",
              }}
            >
              {item.label}
            </a>
          ))}

          <div className="flex gap-5 pt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { toggleLanguage(lang.code); setMenuOpen(false); }}
                className={`text-xs tracking-[0.25em] uppercase transition-colors ${
                  i18n.language === lang.code ? "text-amber-500 font-semibold" : "text-white/30 hover:text-white"
                }`}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full-Screen Luxury Search Overlay ── */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex flex-col items-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"
          style={{ overflowY: "auto", padding: "40px 20px" }}
        >
          {/* Close Button */}
          <button 
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            className="absolute top-4 right-5 text-white/60 hover:text-white transition-colors p-4 z-[10001] cursor-pointer"
            aria-label={isTr ? "Kapat" : isAr ? "إغلاق" : "Close"}
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          {/* Search Input Box */}
          <div className="w-full max-w-4xl mt-16 sm:mt-24 px-4">
            <div className="flex items-center gap-4 border-b border-white/20 pb-4 focus-within:border-amber-500/60 transition-colors duration-300">
              <Search size={28} className="text-white/40" strokeWidth={1.5} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isTr ? "kbchrono saatleri arasında arayın..." 
                  : isAr ? "ابحث في ساعات kbchrono..." 
                  : "Search kbchrono timepieces..."
                }
                className="w-full bg-transparent border-none text-white text-xl sm:text-3xl font-light placeholder-white/20 focus:outline-none focus:ring-0"
                dir={isAr ? "rtl" : "ltr"}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-white/40 hover:text-white transition-colors p-1">
                  <X size={20} />
                </button>
              )}
            </div>
            <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mt-3 text-right">
              {isTr ? "Kapatmak için ESC'ye basın" : isAr ? "اضغط على ESC للإغلاق" : "Press ESC to close"}
            </p>
          </div>

          {/* Popular Collections / Quick Searches */}
          {!searchQuery && (
            <div className="w-full max-w-4xl mt-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-5 font-semibold">
                {isTr ? "Popüler Koleksiyonlar" : isAr ? "المجموعات الشائعة" : "Popular Collections"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Richard Mille", "Audemars Piguet", "Rolex", "Patek Philippe", "Cartier", "Omega"].map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSearchQuery(brand)}
                    className="px-5 py-2.5 rounded-full border border-white/10 hover:border-amber-500/40 bg-white/[0.02] hover:bg-amber-500/5 text-white/70 hover:text-white text-xs tracking-[0.15em] transition-all duration-300 cursor-pointer"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="w-full max-w-4xl mt-12 px-4 flex-1 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <h3 className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-semibold">
                  {isTr ? "Arama Sonuçları" : isAr ? "نتائج البحث" : "Search Results"}
                </h3>
                <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
                  {filteredWatches.length} {isTr ? "Saat Bulundu" : isAr ? "ساعات تم العثور عليها" : "Timepieces Found"}
                </p>
              </div>

              {filteredWatches.length === 0 ? (
                <div className="text-center py-20 animate-in fade-in duration-300">
                  <p className="text-sm tracking-[0.2em] text-white/40 uppercase">
                    {isTr ? "Eşleşen saat bulunamadı" : isAr ? "لم يتم العثور على ساعات مطابقة" : "No matching timepieces found"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pr-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
                  {filteredWatches.map(watch => (
                    <Link
                      key={watch.id}
                      to={`/watch/${watch.id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-4 p-3 rounded-lg border border-white/5 hover:border-amber-500/20 bg-white/[0.01] hover:bg-amber-500/[0.02] group transition-all duration-300"
                    >
                      <div className="w-16 h-16 rounded bg-neutral-900/60 overflow-hidden flex items-center justify-center p-1 border border-white/5 group-hover:border-amber-500/20 transition-colors flex-shrink-0">
                        <img
                          src={watch.image}
                          alt={watch.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-[0.2em] text-amber-500/80 uppercase font-medium truncate">
                          {watch.collection}
                        </p>
                        <h4 className="text-xs tracking-wider text-white group-hover:text-amber-500 transition-colors font-medium truncate mt-0.5">
                          {watch.name}
                        </h4>
                        <p className="text-[9px] tracking-wide text-white/40 truncate mt-1">
                          {watch.tagline}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
