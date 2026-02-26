export const NOTIFICATION_CHANNELS = {
  DAILY_REMINDERS: "daily-reminders",
} as const;

export const NOTIFICATION_IDS = {
  DRIVER: "daily-driver-reminder",
  FUEL: "daily-fuel-reminder",
  PARKING: "daily-parking-reminder",
} as const;

export const SCHEDULE_TIMES = {
  DRIVER: { hour: 9, minute: 0 },
  FUEL: { hour: 12, minute: 0 },
  PARKING: { hour: 19, minute: 0 },
} as const;
