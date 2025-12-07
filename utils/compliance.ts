import dayjs from "dayjs";
import { Activity } from "./driver-db";

export interface ComplianceStatus {
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
}

export type DailyStats = {
  date: Date;
  totalHours: number;
  drivingHours: number;
  workHours: number;
  breakHours: number;
  restHours: number;
};

export type WeeklyStats = {
  totalWorkHours: number;
  totalDrivingHours: number;
  totalBreakHours: number;
  totalRestHours: number;
  dailyStats: DailyStats[];
};

export const calculateDailyStats = (
  activities: Activity[],
  date: Date
): DailyStats => {
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();

  const dayActivities = activities.filter(
    (a) =>
      a.startDateTime >= startOfDay && a.startDateTime <= endOfDay
  );

  const stats: DailyStats = {
    date,
    totalHours: 0,
    drivingHours: 0,
    workHours: 0,
    breakHours: 0,
    restHours: 0,
  };

  dayActivities.forEach((activity) => {
    stats.totalHours += activity.duration;

    switch (activity.type) {
      case "driving":
        stats.drivingHours += activity.duration;
        break;
      case "work":
        stats.workHours += activity.duration;
        break;
      case "break":
        stats.breakHours += activity.duration;
        break;
      case "rest":
        stats.restHours += activity.duration;
        break;
    }
  });

  return stats;
};

export const calculateWeeklyStats = (
  activities: Activity[],
  dates: Date[]
): WeeklyStats => {
  const dailyStats = dates.map((date) =>
    calculateDailyStats(activities, date)
  );

  const stats: WeeklyStats = {
    totalWorkHours: 0,
    totalDrivingHours: 0,
    totalBreakHours: 0,
    totalRestHours: 0,
    dailyStats,
  };

  dailyStats.forEach((day) => {
    stats.totalWorkHours += day.drivingHours + day.workHours;
    stats.totalDrivingHours += day.drivingHours;
    stats.totalBreakHours += day.breakHours;
    stats.totalRestHours += day.restHours;
  });

  return stats;
};
