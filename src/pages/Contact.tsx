import LuxuryNav from "@/components/LuxuryNav";
import LuxuryFooter from "@/components/LuxuryFooter";
import { useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";

const Contact = () => {
  const { t } = useTranslation();
  const revealRef = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      label: t("contact.phoneLabel"),
      value: "+90 531 697 72 25",
      href: "tel:+905316977225"
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      label: t("contact.emailLabel"),
      value: "info@kbchrono.com",
      href: "mailto:info@kbchrono.com"
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      label: t("contact.addressDubaiLabel"),
      value: t("contact.addressDubai"),
      href: "https://maps.google.com/?q=Nobles+Tower+Business+Bay+Dubai"
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      label: t("contact.addressIstanbulLabel"),
      value: t("contact.addressIstanbul"),
      href: "https://maps.google.com/?q=Vezirköşkü+sokak+Bebek+İstanbul"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />
      <main className="pt-32 pb-20 px-6 lg:px-12" ref={revealRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 reveal">
              {t("contact.subtitle")}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 reveal reveal-delay-1">
              {t("nav.contact")}
            </h1>
            <div className="w-20 h-[1px] bg-primary/50 mx-auto reveal reveal-delay-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.href}
                className={`group p-8 border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 reveal reveal-delay-${idx + 3} luxury-border-glow rounded-sm`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                      {info.label}
                    </p>
                    <p className="text-lg font-medium tracking-wide group-hover:text-primary transition-colors duration-500">
                      {info.value}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default Contact;
