import en from "./dictionaries/en";
import he from "./dictionaries/he";

export type Dictionary = typeof en | typeof he;

export async function getDictionary(locale: string): Promise<Dictionary> {
  switch (locale) {
    case "he":
      return he;
    case "en":
    default:
      return en;
  }
}
