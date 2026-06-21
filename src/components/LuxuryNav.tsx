import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, ChevronDown, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", flag: "EN" },
  { code: "tr", label: "Türkçe", flag: "TR" },
  { code: "ar", label: "العربية", flag: "AR" },
];

const LuxuryNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [location]);

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("i18nextLng_manual", "true");
    setLangOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const navItems = [
    { label: t("nav.collections"), href: "/collections" },
    { label: t("nav.craftsmanship"), href: "/#craftsmanship" },
    { label: t("nav.story"), href: "/#story" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <>
      {/* ── Top Bar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link to="/#hero" className="flex items-center gap-2 group flex-shrink-0">
              <img
                src="/kb-logo.png"
                alt="kbchrono"
                className="h-14 sm:h-[4.5rem] w-auto transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-gradient-gold text-lg font-bold tracking-[0.3em] uppercase hidden lg:block">
                kbchrono
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground text-xs tracking-[0.2em] uppercase transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}

              <a
                href="https://www.instagram.com/chrono.kb/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-primary hover:scale-110 transition-transform" />
              </a>

              {/* Desktop Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs tracking-[0.2em] uppercase transition-colors duration-300"
                >
                  <Globe size={16} className="text-primary" />
                  <span>{currentLang.flag}</span>
                  <ChevronDown
                    size={10}
                    className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {langOpen && (
                  <div className="absolute top-full right-0 mt-4 w-40 bg-background/95 backdrop-blur-xl border border-border/50 py-2 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => toggleLanguage(lang.code)}
                        className={`w-full text-left px-6 py-3 text-xs tracking-[0.1em] uppercase transition-colors hover:bg-primary/10 ${
                          i18n.language === lang.code ? "text-primary font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Right Controls */}
            <div className="flex items-center gap-3 md:hidden">
              <a
                href="https://www.instagram.com/chrono.kb/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground p-1.5"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-primary" />
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-foreground p-1.5"
                aria-label="Toggle menu"
              >
                <Menu size={22} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Full-Screen Mobile Overlay ── */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "#000000" }}
      >
        {/* Close Button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-5 right-5 text-foreground p-2 z-50 hover:text-primary transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X size={26} />
        </button>

        {/* Logo in overlay */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 left-4 flex items-center gap-2 z-50 cursor-pointer"
        >
          <img src="/kb-logo.png" alt="kbchrono" className="h-14 w-auto" />
          <span className="text-gradient-gold text-base font-bold tracking-[0.3em] uppercase">
            kbchrono
          </span>
        </Link>

        {/* Nav Links — staggered slide-in */}
        <div
          className={`flex flex-col justify-center h-full px-10 gap-9 transition-all duration-500 ${
            menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
          style={{ transitionDelay: menuOpen ? "0.08s" : "0s" }}
        >
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-foreground/90 text-2xl font-light tracking-[0.25em] uppercase hover:text-primary transition-colors duration-300 border-b border-white/5 pb-9"
              style={{ transitionDelay: `${0.04 * i}s` }}
            >
              {item.label}
            </Link>
          ))}

          {/* Language row */}
          <div className="flex gap-6 pt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { toggleLanguage(lang.code); setMenuOpen(false); }}
                className={`text-sm tracking-[0.25em] uppercase transition-colors duration-200 ${
                  i18n.language === lang.code
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.flag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LuxuryNav;
