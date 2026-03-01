import dayjs from "@/utils/dayjs-config";
import { apiFetch } from "./client";

export interface IFuelPrice {
  country: string;
  countryCode: string;
  petrol: number;
  diesel: number;
  currencyHome?: string;
  petrolHome?: number;
  dieselHome?: number;
}

export interface IFuel {
  _id: string;
  date: string;
  countries: IFuelPrice[];
  createdAt: Date;
  updatedAt: Date;
}

export const getFuelData = async (date?: string): Promise<IFuel | null> => {
  const path = date ? `/api/fuel?date=${date}` : `/api/fuel`;
  return apiFetch<IFuel>(path);
};

export const getStaleTimeForFuelData = (lastDataDate?: string): number => {
  const now = dayjs();
  const currentDay = now.day();
  const currentHour = now.hour();

  const isThursday = currentDay === 4;
  const isAfterNoon = currentHour >= 12;

  if (isThursday && isAfterNoon) {
    return 1000 * 60 * 60;
  }

  if (lastDataDate) {
    const dataDate = dayjs(lastDataDate);

    const mostRecentThursday = now
      .day(4)
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0);

    const adjustedMostRecentThursday = mostRecentThursday.isAfter(now)
      ? mostRecentThursday.subtract(1, "week")
      : mostRecentThursday;

    const isDataFromMostRecentThursday =
      dataDate.isSame(adjustedMostRecentThursday, "day") ||
      dataDate.isAfter(adjustedMostRecentThursday);

    if (isDataFromMostRecentThursday) {
      const nextThursday = now
        .day(4)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

      const adjustedNextThursday = nextThursday.isBefore(now)
        ? nextThursday.add(1, "week")
        : nextThursday;

      const timeUntilNextThursday = adjustedNextThursday.diff(now);
      return Math.max(timeUntilNextThursday, 1000 * 60 * 60);
    }
  }

  return 1000 * 60 * 60;
};
