import { Languages } from "@/types/language";
import dayjs, { getDayjsLocale } from "@/utils/dayjs-config";
import { LocaleConfig } from "react-native-calendars";

const generateCalendarLocale = (language: Languages) => {
  const dayjsLocale = getDayjsLocale(language);
  const localizedDayjs = dayjs().locale(dayjsLocale);

  return {
    monthNames: localizedDayjs.localeData().months(),
    monthNamesShort: localizedDayjs.localeData().monthsShort(),
    dayNames: localizedDayjs.localeData().weekdays(),
    dayNamesShort: localizedDayjs.localeData().weekdaysShort(),
    today: "Today",
  };
};

export const initializeCalendarLocales = () => {
  Object.values(Languages).forEach((language) => {
    LocaleConfig.locales[language] = generateCalendarLocale(language);
  });
};

export const configureCalendarLocale = (language: Languages) => {
  LocaleConfig.defaultLocale = language;
};
