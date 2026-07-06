import { cookies } from "next/headers";
import { translations, type Lang } from "./i18n-data";

export type { Lang };
export { translations };

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get("lang")?.value === "ar" ? "ar" : "en";
}

export function getDict(lang: Lang) {
  return translations[lang];
}
