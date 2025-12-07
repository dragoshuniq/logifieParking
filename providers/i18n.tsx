import en from "@/locales/en.json";
import { configureDayjsLocale } from "@/utils/dayjs-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import * as i18next from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "@language";

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

export const persistLanguage = async (language: Languages) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export const loadPersistedLanguage = async (): Promise<Languages> => {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) {
    return validateLanguage(stored);
  }
  return validateLanguage(
    Localization.getLocales()[0]?.languageCode || Languages.EN
  );
};

const resources = {
  en: { translation: en },
};

const initI18n = async () => {
  const language = await loadPersistedLanguage();

  i18next.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: language,
    interpolation: {
      escapeValue: false,
    },
  });

  configureDayjsLocale(language);

  i18next.on("languageChanged", (lng) => {
    configureDayjsLocale(lng);
  });
};

initI18n();

export default i18next;
