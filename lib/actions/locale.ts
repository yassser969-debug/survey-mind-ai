"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE } from "../i18n";

export async function setLocale(formData: FormData): Promise<void> {
  const locale = String(formData.get("locale") ?? "en");
  if (locale !== "en" && locale !== "ar" && locale !== "es") return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
