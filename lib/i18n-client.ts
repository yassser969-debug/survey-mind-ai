"use client";

import { useSyncExternalStore } from "react";
import { translations, type Lang } from "./i18n-data";

function subscribe() {
  return () => {};
}

function getServerSnapshot(): Lang {
  return "en";
}

export function getClientLang(): Lang {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )lang=([^;]+)/);
  return match?.[1] === "ar" ? "ar" : "en";
}

export function setClientLang(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function getClientDict(lang: Lang) {
  return translations[lang];
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getClientLang, getServerSnapshot);
  return { lang, t: translations[lang] };
}
