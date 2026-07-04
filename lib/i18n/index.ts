import "server-only";

import { cookies } from "next/headers";
import { dictionaries, type Dict } from "./dictionaries";

export type Locale = "en" | "ar" | "es";
export type { Dict };

export const LOCALE_COOKIE = "sm_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "ar" || value === "es" ? value : "en";
}

export async function getDict(): Promise<Dict> {
  return dictionaries[await getLocale()];
}
