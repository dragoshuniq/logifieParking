import de from "@/locales/de.json";
import en from "@/locales/en.json";
import * as Localization from "expo-localization";
import * as i18next from "i18next";
import { initReactI18next } from "react-i18next";

export enum Languages {
  EN = "en",
  DE = "de",
  FR = "fr",
  PL = "pl",
  UA = "ua",
  RO = "ro",
  ES = "es",
  PT = "pt",
  IT = "it",
  NL = "nl",
  SE = "se",
  NO = "no",
  FI = "fi",
  DK = "dk",
  TR = "tr",
}

export const LANGUAGE_NAMES: Record<Languages, string> = {
  [Languages.EN]: "English",
  [Languages.DE]: "Deutsch",
  [Languages.FR]: "Français",
  [Languages.PL]: "Polski",
  [Languages.UA]: "Українська",
  [Languages.RO]: "Română",
  [Languages.ES]: "Español",
  [Languages.PT]: "Português",
  [Languages.IT]: "Italiano",
  [Languages.NL]: "Nederlands",
  [Languages.SE]: "Svenska",
  [Languages.NO]: "Norsk",
  [Languages.FI]: "Suomi",
  [Languages.DK]: "Dansk",
  [Languages.TR]: "Türkçe",
};

export const LANGUAGE_FLAGS: Record<Languages, string> = {
  [Languages.EN]: "GB",
  [Languages.DE]: "DE",
  [Languages.FR]: "FR",
  [Languages.PL]: "PL",
  [Languages.UA]: "UA",
  [Languages.RO]: "RO",
  [Languages.ES]: "ES",
  [Languages.PT]: "PT",
  [Languages.IT]: "IT",
  [Languages.NL]: "NL",
  [Languages.SE]: "SE",
  [Languages.NO]: "NO",
  [Languages.FI]: "FI",
  [Languages.DK]: "DK",
  [Languages.TR]: "TR",
};

export const validateLanguage = (language: string): Languages => {
  if (Object.values(Languages).includes(language as Languages)) {
    return language as Languages;
  }
  return Languages.EN;
};

const resources = {
  en: en,
  de: de,
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: Localization.getLocales()[0]?.languageCode || "en",
  fallbackLng: Languages.EN,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
