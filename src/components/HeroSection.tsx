import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import vid1 from "@/assets/vecteezy_golden-mechanical-skeleton-pocket-watch-hands-moving-fast-to_77651467.mp4";
import vid2 from "@/assets/vecteezy_uae-dubai-united-arab-emirates-01-april-2024-mesmerizing_42639095.mp4";
import vid3 from "@/assets/vecteezy_dubai-uae-2022-unique-golden-geneva-brand-watches-in_19428067.mp4";
import vid4 from "@/assets/vecteezy_dubai-uae-march-20-of-2021-panorama-of-bluwater-island_16475601.mp4";
import vid5 from "@/assets/vecteezy_close-up-of-a-gold-watch-with-a-gold-face_71468457.mp4";
import vid6 from "@/assets/vecteezy_sunrise-over-dubai-skyline_52003429.mp4";
import vid7 from "@/assets/vecteezy_a-detailed-shot-of-a-gold-watch-with-a-diamondencrusted_47879434.mp4";

const VIDEOS = [vid1, vid2, vid3, vid4, vid5, vid6, vid7];

/**
 * Time each video is shown before crossfade begins (ms).
 */
const PLAY_DURATION = 5000;

/**
 * Crossfade duration (ms).
 */
const FADE_DURATION = 1200;

const HeroSection = () => {
  const { t, i18n } = useTranslation();

  /**
   * One ref per video — all 7 are ALWAYS in the DOM and ALWAYS playing.
   * We never touch src, load(), or mount/unmount anything.
   * Transitions are pure GPU opacity changes only.
   */
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(Array(VIDEOS.length).fill(null));
  const ctx = useRef({
    currentIdx: 0,
    timer: null as ReturnType<typeof setTimeout> | null,
  });

  useEffect(() => {
    const vids = videoRefs.current as HTMLVideoElement[];

    // --- Initial state: only video[0] visible, rest hidden ---
    vids.forEach((v, i) => {
      // Remove any lingering transition so initial opacity is instant
      v.style.transition = "none";
      v.style.opacity = i === 0 ? "1" : "0";
      // All videos play continuously in background (muted) from the start.
      // This means by the time we crossfade to one it has been playing for a while
      // and the browser has it fully decoded — zero decode stutter.
      v.play().catch(() => {});
    });

    const doSwap = () => {
      const { currentIdx } = ctx.current;
      const nextIdx = (currentIdx + 1) % VIDEOS.length;

      const current = vids[currentIdx];
      const next = vids[nextIdx];

      // Pure CSS opacity crossfade on the GPU compositing layer.
      // No src change, no load, no React state update — nothing to cause a stutter.
      const transition = `opacity ${FADE_DURATION}ms ease-in-out`;
      current.style.transition = transition;
      next.style.transition = transition;
      current.style.opacity = "0";
      next.style.opacity = "1";

      ctx.current.currentIdx = nextIdx;
      ctx.current.timer = setTimeout(doSwap, PLAY_DURATION);
    };

    ctx.current.timer = setTimeout(doSwap, PLAY_DURATION);

    return () => {
      if (ctx.current.timer) clearTimeout(ctx.current.timer);
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* ── Video Background ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {VIDEOS.map((src, i) => (
          <video
            key={i}
            ref={el => { videoRefs.current[i] = el; }}
            src={src}
            autoPlay
            muted
            playsInline
            loop
            /*
             * will-change: opacity forces the browser to promote this element
             * to its own GPU compositing layer. Opacity changes never trigger
             * a paint or layout — they are applied entirely on the GPU.
             * This eliminates any CPU-side decode stutter during crossfades.
             */
            style={{ willChange: "opacity" }}
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
