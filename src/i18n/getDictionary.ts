import type { Locale } from "./locales";
import en from "./dictionaries/en";
import he from "./dictionaries/he";

export type Dictionary = typeof en;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "he":
      return he;
    case "en":
    default:
      return en;
  }
}
