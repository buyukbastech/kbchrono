import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import vid1 from "@/assets/kbchrono.mp4";
import vid2 from "@/assets/vecteezy_uae-dubai-united-arab-emirates-01-april-2024-mesmerizing_42639095.mp4";
import vid3 from "@/assets/kbchrono2.mp4";
import vid4 from "@/assets/vecteezy_dubai-uae-march-20-of-2021-panorama-of-bluwater-island_16475601.mp4";
import vid5 from "@/assets/kbchrono3.mp4";
import vid6 from "@/assets/vecteezy_dubai-uae-march-24-2022-the-nightly-panorama-of-funtain_20918871.mp4";

/**
 * Banner video sequence configuration.
 * - kbchrono clips: ~10 seconds natural display duration.
 * - Dubai clips: 5 minutes (300,000 ms) display duration.
 */
const VIDEO_CONFIG = [
  { src: vid1, duration: 6000 },  // 1. kbchrono.mp4 (6 seconds - finishes before 7.42s white flash)
  { src: vid2, duration: 5000 },  // 2. Dubai Mesmerizing (5 seconds)
  { src: vid3, duration: 10000 }, // 3. kbchrono2.mp4 (10 seconds)
  { src: vid4, duration: 5000 },  // 4. Bluewaters Island (5 seconds)
  { src: vid5, duration: 10000 }, // 5. kbchrono3.mp4 (10 seconds)
  { src: vid6, duration: 5000 },  // 6. Dubai Fountain (5 seconds)
];

/**
 * Crossfade transition duration (ms).
 */
const FADE_DURATION = 1200;

const HeroSection = () => {
  const { t, i18n } = useTranslation();

  const videoRefs = useRef<(HTMLVideoElement | null)[]>(Array(VIDEO_CONFIG.length).fill(null));
  const ctx = useRef({
    currentIdx: 0,
    timer: null as ReturnType<typeof setTimeout> | null,
  });

  useEffect(() => {
    const vids = videoRefs.current.filter((v): v is HTMLVideoElement => v !== null);

    // Initial state: start video 0 immediately, mute all, pause others
    vids.forEach((v, i) => {
      v.muted = true;
      v.volume = 0;
      v.style.transition = "none";
      v.style.opacity = i === 0 ? "1" : "0";
      if (i === 0) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });

    const doSwap = () => {
      const { currentIdx } = ctx.current;
      const nextIdx = (currentIdx + 1) % VIDEO_CONFIG.length;

      const current = vids[currentIdx];
      const next = vids[nextIdx];

      if (!current || !next) return;

      // 1. Pre-play next video right before transition
      next.muted = true;
      next.volume = 0;
      next.play().then(() => {
        // 2. Crossfade opacity
        const transition = `opacity ${FADE_DURATION}ms ease-in-out`;
        current.style.transition = transition;
        next.style.transition = transition;
        current.style.opacity = "0";
        next.style.opacity = "1";

        // 3. Pause old video after transition ends
        setTimeout(() => {
          if (ctx.current.currentIdx === nextIdx) {
            current.pause();
          }
        }, FADE_DURATION);
      }).catch((err) => {
        console.warn("Video autoplay blocked or failed:", err);
        const transition = `opacity ${FADE_DURATION}ms ease-in-out`;
        current.style.transition = transition;
        next.style.transition = transition;
        current.style.opacity = "0";
        next.style.opacity = "1";
      });

      ctx.current.currentIdx = nextIdx;
      // Schedule next video swap according to the new active video's duration
      ctx.current.timer = setTimeout(doSwap, VIDEO_CONFIG[nextIdx].duration);
    };

    // Schedule first swap after video 0's duration
    ctx.current.timer = setTimeout(doSwap, VIDEO_CONFIG[0].duration);

    return () => {
      if (ctx.current.timer) clearTimeout(ctx.current.timer);
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* ── Video Background ── */}
      <div className="absolute inset-0 bg-black" style={{ zIndex: 0 }}>
        {VIDEO_CONFIG.map((item, i) => (
          <video
            key={i}
            ref={el => { videoRefs.current[i] = el; }}
            src={item.src}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            style={{
              willChange: "opacity",
              opacity: i === 0 ? 1 : 0,
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}

        {/* Dark overlays — always on top of videos */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent"
          style={{ zIndex: 2 }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p
          className="text-primary text-xs tracking-[0.4em] uppercase mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {t("hero.subtitle")}
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1] md:leading-[0.95] mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          {i18n.language === "en" ? (
            <>
              Engineered for
              <br className="hidden sm:block" />
              <span className="text-gradient-gold"> Excellence</span>
            </>
          ) : i18n.language === "tr" ? (
            <>
              Mükemmellik İçin
              <br className="hidden sm:block" />
              <span className="text-gradient-gold"> Tasarlandı</span>
            </>
          ) : (
            <>
              هندسة من أجل
              <br className="hidden sm:block" />
              <span className="text-gradient-gold"> التميز</span>
            </>
          )}
        </h1>
        <p
          className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-xl mx-auto mb-12 px-4 sm:px-0 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.9s" }}
        >
          {t("hero.description")}
        </p>
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: "1.1s" }}>
          <a
            href="/collections"
            className="inline-block bg-gradient-gold text-primary-foreground px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity duration-300"
          >
            {t("hero.cta")}
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent animate-float" />
      </div>

    </section>
  );
};

export default HeroSection;
