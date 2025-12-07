import en from "@/locales/en.json";
import {
  LANGUAGE_FLAGS,
  LANGUAGE_NAMES,
  Languages,
} from "@/types/language";
import { configureCalendarLocale } from "@/utils/calendar-config";
import { configureDayjsLocale } from "@/utils/dayjs-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import * as i18next from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "@language";

export { LANGUAGE_FLAGS, LANGUAGE_NAMES, Languages };

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
    fallbackLng: Languages.EN,
    interpolation: {
      escapeValue: false,
    },
  });

  configureDayjsLocale(language);
  configureCalendarLocale(language);
};

initI18n();

export default i18next;
