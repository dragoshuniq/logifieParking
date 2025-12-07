import dayjs from "dayjs";
import "dayjs/locale/da";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/fi";
import "dayjs/locale/fr";
import "dayjs/locale/it";
import "dayjs/locale/nb";
import "dayjs/locale/nl";
import "dayjs/locale/pl";
import "dayjs/locale/pt";
import "dayjs/locale/ro";
import "dayjs/locale/sv";
import "dayjs/locale/tr";
import "dayjs/locale/uk";
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localeData);

const localeMap: Record<string, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  pl: "pl",
  ua: "uk",
  ro: "ro",
  es: "es",
  pt: "pt",
  it: "it",
  nl: "nl",
  se: "sv",
  no: "nb",
  fi: "fi",
  dk: "da",
  tr: "tr",
};

export const getDayjsLocale = (locale: string): string => {
  return localeMap[locale] || locale;
};

export const configureDayjsLocale = (locale: string) => {
  const dayjsLocale = getDayjsLocale(locale);
  dayjs.locale(dayjsLocale);
};

export default dayjs;
