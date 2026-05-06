import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Session-level global cache so different components share translations
const globalCache: Record<string, Record<string, string>> = {};

async function translateOne(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return text;

  // Try Google Translate unofficial (gtx client - works with CORS)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const translated: string = (json?.[0] ?? [])
        .map((part: any[]) => part?.[0] ?? "")
        .join("")
        .trim();
      if (translated && translated !== text) return translated;
    }
  } catch {/* fall through */}

  // Fallback: MyMemory
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|${targetLang}`
    );
    if (res.ok) {
      const json = await res.json();
      const translated = json?.responseData?.translatedText;
      if (translated && translated !== text) return translated;
    }
  } catch {/* fall through */}

  return text; // give back original if everything fails
}

/**
 * Auto-translates a flat object of Turkish strings.
 * Usage: const translated = useAutoTranslate({ name, description, movement, ... });
 * Returns translated version of the object for the active i18n language.
 */
export function useAutoTranslate(
  content: Record<string, string>,
  sourceLang = "tr"
) {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<Record<string, string>>(content);
  const [isTranslating, setIsTranslating] = useState(false);

  // Stable key to identify this content in cache
  const cacheKey = useRef<string>("");

  useEffect(() => {
    const lang = i18n.language;

    // No-op if already in source language
    if (lang === sourceLang) {
      setTranslated(content);
      return;
    }

    // Build a cache key from content values
    const newKey = Object.values(content).join("|").slice(0, 120);
    cacheKey.current = newKey;

    const globalKey = `${lang}::${newKey}`;
    if (globalCache[globalKey]) {
      setTranslated(globalCache[globalKey]);
      return;
    }

    // Translate all fields
    let cancelled = false;
    setIsTranslating(true);

    (async () => {
      const result: Record<string, string> = {};
      for (const [field, value] of Object.entries(content)) {
        if (!value) { result[field] = value; continue; }
        result[field] = await translateOne(value, lang);
      }
      if (!cancelled) {
        globalCache[globalKey] = result;
        setTranslated(result);
        setIsTranslating(false);
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, JSON.stringify(content)]);

  return { translated, isTranslating };
}
