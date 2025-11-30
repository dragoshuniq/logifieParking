"use client";

import { TIMEZONE } from "@/constants/app.const";
import { useTranslation } from "react-i18next";

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
