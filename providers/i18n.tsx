import { LANGUAGE_FLAGS, LANGUAGE_NAMES, Languages } from "@/types/language";
import { configureCalendarLocale } from "@/utils/calendar-config";
import { configureDayjsLocale } from "@/utils/dayjs-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storage";
import * as Localization from "expo-localization";
import * as i18next from "i18next";
import { initReactI18next } from "react-i18next";

import de from "@/locales/de.json";
import dk from "@/locales/dk.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fi from "@/locales/fi.json";
import fr from "@/locales/fr.json";
import it from "@/locales/it.json";
import nl from "@/locales/nl.json";
import no from "@/locales/no.json";
import pl from "@/locales/pl.json";
import pt from "@/locales/pt.json";
import ro from "@/locales/ro.json";
import se from "@/locales/se.json";
import tr from "@/locales/tr.json";
import ua from "@/locales/ua.json";

export { LANGUAGE_FLAGS, LANGUAGE_NAMES, Languages };

export const validateLanguage = (language: string): Languages => {
  if (Object.values(Languages).includes(language as Languages)) {
    return language as Languages;
  }
  return Languages.EN;
};

export const persistLanguage = async (language: Languages) => {
  await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
};

export const loadPersistedLanguage = async (): Promise<Languages> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (stored) {
    return validateLanguage(stored);
  }

  const systemLanguage = validateLanguage(
    Localization?.getLocales?.()?.[0]?.languageCode || Languages.EN
  );
  await persistLanguage(systemLanguage);
  return systemLanguage;
};

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  pl: { translation: pl },
  ua: { translation: ua },
  ro: { translation: ro },
  es: { translation: es },
  pt: { translation: pt },
  it: { translation: it },
  nl: { translation: nl },
  se: { translation: se },
  no: { translation: no },
  fi: { translation: fi },
  dk: { translation: dk },
  tr: { translation: tr },
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
