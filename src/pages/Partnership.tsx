import LuxuryNav from "@/components/LuxuryNav";
import LuxuryFooter from "@/components/LuxuryFooter";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";
import { Code2, Cpu, Database, ExternalLink, Sparkles } from "lucide-react";

const Partnership = () => {
  const { t } = useTranslation();
  const revealRef = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const expertise = [
    {
      icon: <Code2 className="w-6 h-6 text-primary" />,
      title: t("partnership.services.web.title"),
      desc: t("partnership.services.web.desc"),
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: t("partnership.services.crm.title"),
      desc: t("partnership.services.crm.desc"),
    },
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: t("partnership.services.ai.title"),
      desc: t("partnership.services.ai.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />
      
      <main className="pt-32 pb-24 px-6 lg:px-12" ref={revealRef}>
        <div className="max-w-7xl mx-auto">
          
          {/* ── Hero Section ── */}
          <div className="text-center mb-24">
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 reveal">
              {t("partnership.subtitle")}
            </p>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 text-gradient-gold reveal reveal-delay-1">
              {t("partnership.title")}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed reveal reveal-delay-2">
              {t("partnership.description")}
            </p>
            <div className="w-24 h-[1px] bg-primary/50 mx-auto mt-8 reveal reveal-delay-3" />
          </div>

          {/* ── Core Synergy / Platform Creation Story ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
            
            {/* Left side: Description & Quick Tech details (5 columns on desktop) */}
            <div className="lg:col-span-5 space-y-6 reveal reveal-delay-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium">
                  Digital Engineering
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                {t("partnership.projectStory.title")}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("partnership.projectStory.desc")}
              </p>
            </div>
            
            {/* Right side: Pyzerion Website Mockup Window (7 columns on desktop) */}
            <div className="lg:col-span-7 relative group reveal reveal-delay-5">
              <div className="absolute -inset-1 bg-gradient-gold rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
              
              {/* Browser frame */}
              <div className="relative rounded-lg overflow-hidden border border-border bg-background/80 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-primary/30">
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex-1 max-w-[240px] mx-auto bg-black/40 rounded px-3 py-0.5 text-[10px] text-muted-foreground text-center font-mono flex items-center justify-center gap-1 border border-border/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    www.pyzerion.com
                  </div>
                  <div className="w-12" /> {/* spacer */}
                </div>
                
                {/* Content Area */}
                <div className="relative overflow-hidden aspect-[4/3] sm:aspect-video bg-[#030712] text-white p-6 sm:p-8 flex flex-col justify-between select-none">
                  {/* Nebula Glow Background */}
                  <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />
                  
                  {/* Pyzerion Logo & Header Row */}
                  <div className="relative flex items-center justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="font-semibold text-xs tracking-wide">Pyzerion<span className="text-blue-500">.</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-[9px] text-slate-400 font-medium">
                      <span>Work</span>
                      <span>Services</span>
                      <span>Stack</span>
                      <span>Contact</span>
                    </div>
                    <button className="px-3 py-1 bg-white text-black text-[9px] font-semibold rounded-full hover:bg-slate-100 transition-all">
                      Get Started
                    </button>
                  </div>

                  {/* Hero Content */}
                  <div className="relative my-auto space-y-3 sm:space-y-4 max-w-xl text-left">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-[8px] text-blue-400 font-medium w-fit">
                      <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                      Intelligent Systems for Modern Brands
                    </div>
                    
                    {/* Heading */}
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                      Intelligent Systems for Seamless Capital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Automation.</span>
                      <span className="text-blue-400 animate-pulse">|</span>
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed max-w-md">
                      Enterprise-level AI-powered response systems and custom CRMs. Designed for companies that don't want to be slowed down by legacy management systems.
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-1">
                      <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[9px] rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                        Get Started ↗
                      </button>
                      <button className="px-4 py-1.5 bg-transparent hover:bg-white/5 text-white font-semibold text-[9px] rounded-full border border-white/20 transition-all">
                        View Work
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* ── Services / Expertise Grid ── */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 reveal reveal-delay-3">
                {t("partnership.services.title")}
              </h2>
              <div className="w-16 h-[1px] bg-primary/30 mx-auto reveal reveal-delay-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {expertise.map((item, idx) => (
                <div
                  key={idx}
                  className={`group p-8 border border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/40 transition-all duration-500 rounded-sm relative reveal reveal-delay-${idx + 4}`}
                >
                  <div className="p-4 rounded-sm bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors duration-500 mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold tracking-wide mb-3 group-hover:text-primary transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Call To Action (Redirection) ── */}
          <div className="max-w-4xl mx-auto reveal reveal-delay-7">
            <div className="relative group overflow-hidden rounded-lg p-10 sm:p-16 border border-primary/25 bg-gradient-to-b from-card/30 to-background flex flex-col items-center text-center space-y-8 luxury-border-glow">
              <div className="space-y-4">
                <p className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
                  Pyzerion
                </p>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight max-w-lg">
                  {t("partnership.tagline")}
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Connect with Pyzerion to build modern websites, secure admin panels, customized CRMs, and intelligent AI voice applications tailored to your business needs.
                </p>
              </div>

              <a
                href="https://www.pyzerion.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-primary-foreground font-semibold text-xs tracking-[0.2em] uppercase rounded-sm hover:opacity-95 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/45"
              >
                <span>{t("partnership.visitWebsite")}</span>
                <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>

        </div>
      </main>

      <LuxuryFooter />
    </div>
  );
};

export default Partnership;
