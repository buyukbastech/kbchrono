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

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/#hero" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="kbchrono" 
              className="h-14 w-auto transition-transform duration-500 group-hover:scale-110" 
            />
            <span className="text-gradient-gold text-xl font-bold tracking-[0.3em] uppercase hidden lg:block">
              kbchrono
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-muted-foreground hover:text-foreground text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/thekunbrands/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram size={18} className="text-primary hover:scale-110 transition-transform" />
            </a>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              >
                <Globe size={16} className="text-primary" />
                <span>{currentLang.flag}</span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute top-full right-0 mt-4 w-40 bg-background/95 backdrop-blur-xl border border-border/50 py-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`w-full text-left px-6 py-3 text-xs tracking-[0.1em] uppercase transition-colors hover:bg-primary/10 ${i18n.language === lang.code ? "text-primary font-bold" : "text-muted-foreground"
                        }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                setMenuOpen(false);
              }}
              className="text-foreground p-1"
            >
              <Globe size={20} />
            </button>
            <a
              href="https://www.instagram.com/thekunbrands/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground p-1"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setLangOpen(false);
              }}
              className="text-foreground p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menus */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 bg-background/95 backdrop-blur-xl border-b border-border/50 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground text-sm tracking-[0.2em] uppercase transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Language Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 bg-background/95 backdrop-blur-xl border-b border-border/50 ${langOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => toggleLanguage(lang.code)}
              className={`text-left text-sm tracking-[0.2em] uppercase transition-colors ${i18n.language === lang.code ? "text-primary font-bold" : "text-muted-foreground"
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default LuxuryNav;
