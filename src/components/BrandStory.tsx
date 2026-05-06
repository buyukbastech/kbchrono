import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

const BrandStory = () => {
  const ref = useReveal();
  const { t } = useTranslation();

  const milestones = [
    { title: t("story.milestones.m1.title"), description: t("story.milestones.m1.description") },
    { title: t("story.milestones.m2.title"), description: t("story.milestones.m2.description") },
    { title: t("story.milestones.m3.title"), description: t("story.milestones.m3.description") },
    { title: t("story.milestones.m4.title"), description: t("story.milestones.m4.description") },
  ];

  return (
    <section id="story" className="py-32 px-6 lg:px-12 bg-card/50" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 reveal">
            {t("story.subtitle")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight reveal reveal-delay-1">
            {t("story.title")}
          </h2>
          <div className="luxury-line w-24 mx-auto mt-8 reveal reveal-delay-2" />
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-16">
            {milestones.map((m, i) => (
              <div
                key={`milestone-${i}`}
                className={`relative flex flex-col md:flex-row items-start gap-8 reveal reveal-delay-${i + 1} ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-2.5 h-2.5 bg-primary rounded-full -translate-x-1/2 mt-2 glow-gold z-10" />

                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <h3 className="text-lg md:text-xl font-bold mb-3">{m.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
