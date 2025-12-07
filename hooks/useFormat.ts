import { TIMEZONE } from "@/constants/app.const";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useTranslation } from "react-i18next";

dayjs.extend(duration);
dayjs.extend(localizedFormat);

export const useFormatDate = () => {
  const {
    i18n: { language },
  } = useTranslation();

  const formatDate = (
    date: string | Date,
    options: Intl.DateTimeFormatOptions = {}
  ) => {
    return new Intl.DateTimeFormat(language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
      timeZone: TIMEZONE,
    }).format(new Date(date));
  };

  return { formatDate };
};

export const useFormatCurrency = () => {
  const {
    i18n: { language },
  } = useTranslation();

  const formatCurrency = (
    amount: number,
    currency: string = "EUR"
  ) => {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
    }).format(amount);
  };

  return { formatCurrency };
};

export const useFormatTime = () => {
  const {
    i18n: { language },
  } = useTranslation();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return new Intl.DateTimeFormat(language, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return { formatTime };
};

export const useFormatDuration = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const formatDuration = (hours: number) => {
    dayjs.locale(language);
    const dur = dayjs.duration(hours, "hours");
    const h = Math.floor(dur.asHours());
    const m = dur.minutes();

    if (m === 0) {
      return `${h}${t("format.hourShort")}`;
    }
    return `${h}${t("format.hourShort")} ${m}${t(
      "format.minuteShort"
    )}`;
  };

  return { formatDuration };
};
